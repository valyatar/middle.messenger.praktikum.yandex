import Block, { BlockProps } from '../framework/Block';
import Route from './Route';

type BlockConstructable<P extends BlockProps> = new (props: P) => Block<P>;

export default class Router {
  private static __instance: Router | null = null;

  private readonly routes: Array<Route<BlockProps>> = [];

  private readonly history: History = window.history;

  private currentRoute: Route<BlockProps> | null = null;

  private readonly rootQuery: string;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.rootQuery = rootQuery;
    Router.__instance = this;
  }

  public use<P extends BlockProps>(pathname: string, block: BlockConstructable<P>, props: P): this {
    const route = new Route<P>(pathname, block, { rootQuery: this.rootQuery, props });
    this.routes.push(route as unknown as Route<BlockProps>);
    return this;
  }

  public start(): void {
    window.onpopstate = () => {
      this.onRoute(window.location.pathname);
    };

    this.onRoute(window.location.pathname);
  }

  private onRoute(pathname: string): void {
    const route = this.getRoute(pathname);

    if (!route) {
      this.go('/');
      return;
    }

    if (this.currentRoute) {
      this.currentRoute.leave();
    }

    this.currentRoute = route;
    route.render();
  }

  public go(pathname: string): void {
    this.history.pushState({}, '', pathname);
    this.onRoute(pathname);
  }

  public back(): void {
    this.history.back();
  }

  public forward(): void {
    this.history.forward();
  }

  private getRoute(pathname: string): Route<BlockProps> | undefined {
    return this.routes.find((route) => route.match(pathname));
  }
}
