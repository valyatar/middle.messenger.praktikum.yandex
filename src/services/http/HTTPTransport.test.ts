import { expect } from 'chai';
import { HTTPTransport } from './HTTPTransport';
import { MockFormData } from '../../test/mocks/MockFormData';
import { setupXhr } from '../../test/setupXhr';

type Handler = ((this: XMLHttpRequest, ev?: ProgressEvent<EventTarget>) => void) | null;
class MockXHR {
  static instances: MockXHR[] = [];

  method = '';

  url = '';

  async = true;

  requestHeaders: Record<string, string> = {};

  timeout = 0;

  status = 200;

  responseText = '{"ok":true}';

  onload: Handler = null;

  onerror: Handler = null;

  onabort: Handler = null;

  ontimeout: Handler = null;

  sentBody: unknown = undefined;

  constructor() {
    MockXHR.instances.push(this);
  }

  open(method: string, url: string, async = true) {
    this.method = method;
    this.url = url;
    this.async = async;
  }

  setRequestHeader(key: string, value: string) {
    this.requestHeaders[key] = value;
  }

  getResponseHeader(name: string): string | null {
    const key = name.toLowerCase();

    if (key === 'content-type') {
      return 'application/json';
    }

    return null;
  }

  send(body?: unknown) {
    this.sentBody = body;
    this.onload?.call(this as unknown as XMLHttpRequest);
  }

  triggerError() {
    this.onerror?.call(this as unknown as XMLHttpRequest);
  }

  triggerAbort() {
    this.onabort?.call(this as unknown as XMLHttpRequest);
  }

  triggerTimeout() {
    this.ontimeout?.call(this as unknown as XMLHttpRequest);
  }
}

describe('HTTPTransport', () => {
  beforeEach(() => {
    MockXHR.instances = [];
    setupXhr(MockXHR);
    (globalThis as any).FormData = MockFormData;
  });

  it('GET appends query string to url', async () => {
    const http = new HTTPTransport();

    await http.get('/test', { data: { a: 1, b: 'x' } });

    const xhr = MockXHR.instances[0];
    expect(xhr.url.endsWith('/test?a=1&b=x')).to.equal(true);
  });


  it('POST sends JSON string body', async () => {
    const http = new HTTPTransport();

    await http.post('/auth', { data: { login: 'u', password: 'p' } });

    const xhr = MockXHR.instances[0];
    expect(xhr.sentBody).to.equal(JSON.stringify({ login: 'u', password: 'p' }));
  });

  it('POST sets Content-Type application/json by default', async () => {
    const http = new HTTPTransport();

    await http.post('/auth', { data: { a: 1 } });

    const xhr = MockXHR.instances[0];
    expect(xhr.requestHeaders['Content-Type']).to.equal('application/json');
  });

  it('FormData is sent without Content-Type header', async () => {
    const http = new HTTPTransport();
    const fd = new (globalThis as unknown as { FormData: new () => MockFormData }).FormData();

    await http.put('/upload', { data: fd });

    const xhr = MockXHR.instances[0];
    expect(xhr.requestHeaders['Content-Type']).to.equal(undefined);
  });

  it('uses provided timeout', async () => {
    const http = new HTTPTransport();

    await http.get('/t', { timeout: 1234 });

    const xhr = MockXHR.instances[0];
    expect(xhr.timeout).to.equal(1234);
  });

  it('rejects promise on error', async () => {
    const http = new HTTPTransport();

    MockXHR.prototype.send = function (body?: unknown) {
      this.sentBody = body;
      this.triggerError();
    };

    let rejected = false;
    try {
      await http.get('/fail');
    } catch {
      rejected = true;
    }

    expect(rejected).to.equal(true);
  });

  it('rejects promise on abort', async () => {
    const http = new HTTPTransport();

    MockXHR.prototype.send = function (body?: unknown) {
      this.sentBody = body;
      this.triggerAbort();
    };

    let rejected = false;
    try {
      await http.get('/abort');
    } catch {
      rejected = true;
    }

    expect(rejected).to.equal(true);
  });

  it('rejects promise on timeout', async () => {
    const http = new HTTPTransport();

    MockXHR.prototype.send = function (body?: unknown) {
      this.sentBody = body;
      this.triggerTimeout();
    };

    let rejected = false;
    try {
      await http.get('/timeout');
    } catch {
      rejected = true;
    }

    expect(rejected).to.equal(true);
  });
});
