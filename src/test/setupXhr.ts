export function setupXhr(MockXHR: unknown): void {
  (globalThis as any).XMLHttpRequest = MockXHR;
}
