import Block, { BlockProps } from '../framework/Block';

type BlockConstructable<P extends BlockProps> = new (props: P) => Block<P>;

export default class Route<P extends BlockProps> {
  private readonly pathname: string;

  private readonly BlockClass: BlockConstructable<P>;

  private readonly rootQuery: string;

  private readonly props: P;

  private block: Block<P> | null = null;

  constructor(pathname: string, block: BlockConstructable<P>, options: { rootQuery: string; props: P }) {
    this.pathname = pathname;
    this.BlockClass = block;
    this.rootQuery = options.rootQuery;
    this.props = options.props;
  }

  public match(pathname: string): boolean {
    return pathname === this.pathname;
  }

  public render(): void {
    const root = document.querySelector(this.rootQuery);
    if (!(root instanceof HTMLElement)) {
      throw new Error(`Root element not found by selector: ${this.rootQuery}`);
    }

    root.innerHTML = '';

    if (!this.block) {
      this.block = new this.BlockClass(this.props);
    }

    root.appendChild(this.block.getContent());
    this.block.show();
  }

  public leave(): void {
    if (this.block) {
      this.block.destroy();
      this.block = null;
    }
  }
}
