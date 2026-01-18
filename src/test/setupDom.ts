import { JSDOM } from 'jsdom';

export function setupDom(): void {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
  });

  class FormDataMock {
    append(): void {}
  }
  const globalAny = globalThis as any;

  globalAny.window = dom.window;
  globalAny.document = dom.window.document;
  globalAny.history = dom.window.history;
  globalAny.location = dom.window.location;
  globalAny.HTMLElement = dom.window.HTMLElement;
  globalAny.Event = dom.window.Event;
  globalAny.DOMParser = dom.window.DOMParser;
  globalAny.FormData = FormDataMock;
}
