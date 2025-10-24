const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

type Method = typeof METHODS[keyof typeof METHODS];

type HTTPMethod = (url: string, options?: Omit<RequestOptions, 'method'>) => Promise<XMLHttpRequest>;

interface RequestOptions {
  method: Method;
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
}

function queryStringify(data: Record<string, unknown>): string {
  const keys = Object.keys(data);
  if (keys.length === 0) {
    return '';
  }

  const params = keys
    .map(key => {
      const value = data[key];
      if (value === null || value === undefined) {
        return null;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .filter((param): param is string => param !== null);

  return params.length > 0 ? `?${params.join('&')}` : '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

class HTTPTransport {
  private createMethod(method: Method): HTTPMethod {
    return (url: string, options: Omit<RequestOptions, 'method'> = {}) => {
      return this.request(url, { ...options, method });
    };
  }

  public readonly get = this.createMethod(METHODS.GET);

  public readonly post = this.createMethod(METHODS.POST);

  public readonly put = this.createMethod(METHODS.PUT);

  public readonly delete = this.createMethod(METHODS.DELETE);

  private request(url: string, options: RequestOptions): Promise<XMLHttpRequest> {
    const { headers = {}, method, data, timeout = 5000 } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      let requestUrl = url;
      if (isGet && data && isRecord(data)) {
        const query = queryStringify(data);
        requestUrl = url + query;
      }

      xhr.open(method, requestUrl);

      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function () {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.timeout = timeout;
      xhr.ontimeout = reject;

      if (isGet || !data) {
        xhr.send();
      } else {
        if (data instanceof FormData) {
          xhr.send(data);
        } else {
          if (!headers['Content-Type']) {
            xhr.setRequestHeader('Content-Type', 'application/json');
          }
          xhr.send(typeof data === 'string' ? data : JSON.stringify(data));
        }
      }
    });
  }
}

export { HTTPTransport };
