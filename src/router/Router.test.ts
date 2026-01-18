import { expect } from 'chai';
import Router from './Router';
import Block, { BlockProps } from '../framework/Block';

function mountRoot(selector = '#page') {
  const el = document.createElement('div');
  el.id = selector.replace('#', '');
  document.body.appendChild(el);
  return el;
}

class TestPage extends Block<{ app: unknown } & BlockProps> {
  render(): string {
    return '<div id="test-page">test-page</div>';
  }
}

function waitPopState(): Promise<void> {
  return new Promise((resolve) => {
    window.addEventListener('popstate', () => resolve(), { once: true });
  });
}

describe('Router', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    mountRoot('#page');

    window.history.replaceState({}, '', '/');

    (Router as unknown as { __instance?: unknown }).__instance = undefined;
  });

  it('use() registers a route', () => {
    const router = new Router('#page');
    router.use('/', TestPage, { app: {} });

    const routes = (router as unknown as { routes?: unknown[] }).routes;
    expect(routes?.length).to.equal(1);
  });

  it('go() changes pathname', () => {
    const router = new Router('#page');
    router.use('/', TestPage, { app: {} }).use('/messenger', TestPage, { app: {} });

    router.start();
    router.go('/messenger');

    expect(window.location.pathname).to.equal('/messenger');
  });

  it('back() navigates back', async () => {
    const router = new Router('#page');
    router.use('/', TestPage, { app: {} }).use('/messenger', TestPage, { app: {} });

    router.start();
    router.go('/messenger');

    const p = waitPopState();
    router.back();
    await p;

    expect(window.location.pathname).to.equal('/');
  });

  it('forward() navigates forward', async () => {
    const router = new Router('#page');
    router.use('/', TestPage, { app: {} }).use('/messenger', TestPage, { app: {} });

    router.start();
    router.go('/messenger');

    let p = waitPopState();
    router.back();
    await p;

    p = waitPopState();
    router.forward();
    await p;

    expect(window.location.pathname).to.equal('/messenger');
  });
});
