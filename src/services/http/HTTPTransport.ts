import { isSuccessStatus } from './HttpStatus';

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

type Method = typeof METHODS[keyof typeof METHODS];

interface RequestOptions {
  method: Method;
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
  withCredentials?: boolean;
}

function queryStringify(data: Record<string, unknown>): string {
  const keys = Object.keys(data);
  if (keys.length === 0) {
    return '';
  }

  const params = keys
    .map((key) => {
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

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== 'undefined' && value instanceof FormData;
}

type ApiErrorShape = { reason?: unknown };

export class HTTPError extends Error {
  public readonly status: number;

  public readonly reason?: string;

  constructor(status: number, message: string, reason?: string) {
    super(message);
    this.status = status;
    this.reason = reason;
  }
}

export class HTTPTransport {
  private readonly baseUrl: string;

  constructor(baseUrl = 'https://ya-praktikum.tech/api/v2') {
    this.baseUrl = baseUrl;
  }

  public get<TResponse>(path: string, options: Omit<RequestOptions, 'method'> = {}): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: METHODS.GET });
  }

  public post<TResponse>(path: string, options: Omit<RequestOptions, 'method'> = {}): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: METHODS.POST });
  }

  public put<TResponse>(path: string, options: Omit<RequestOptions, 'method'> = {}): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: METHODS.PUT });
  }

  public delete<TResponse>(path: string, options: Omit<RequestOptions, 'method'> = {}): Promise<TResponse> {
    return this.request<TResponse>(path, { ...options, method: METHODS.DELETE });
  }

  private request<TResponse>(path: string, options: RequestOptions): Promise<TResponse> {
    const {
      headers = {},
      method,
      data,
      timeout = 5000,
      withCredentials = true, // важно для cookie-сессий Практикума
    } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      let url = `${this.baseUrl}${path}`;

      if (isGet && data && isRecord(data)) {
        url += queryStringify(data);
      }

      xhr.open(method, url);
      xhr.withCredentials = withCredentials;
      xhr.timeout = timeout;

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => {
        const status = xhr.status;

        const contentType = xhr.getResponseHeader('content-type') ?? '';
        const isJson = contentType.includes('application/json');

        let parsed: unknown = undefined;
        if (isJson && xhr.responseText) {
          try {
            parsed = JSON.parse(xhr.responseText);
          } catch {
            parsed = undefined;
          }
        }

        if (isSuccessStatus(status)) {
          resolve(parsed as TResponse);
          return;
        }

        let reason: string | undefined;
        if (isRecord(parsed) && 'reason' in parsed) {
          const r = (parsed as ApiErrorShape).reason;
          if (typeof r === 'string') reason = r;
          else if (r !== undefined) reason = String(r);
        }

        reject(new HTTPError(status, `HTTP error ${status}`, reason));
      };

      xhr.onabort = () => reject(new HTTPError(0, 'Request aborted'));
      xhr.onerror = () => reject(new HTTPError(0, 'Network error'));
      xhr.ontimeout = () => reject(new HTTPError(0, 'Request timeout'));

      if (isGet || data === undefined || data === null) {
        xhr.send();
        return;
      }

      if (isFormData(data)) {
        xhr.send(data);
        return;
      }

      if (!headers['Content-Type']) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }

      xhr.send(typeof data === 'string' ? data : JSON.stringify(data));
    });
  }
}
