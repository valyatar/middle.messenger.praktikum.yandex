import EventBus, { EventCallback } from './EventBus';
import Handlebars from 'handlebars';

export interface BlockProps {
  id?: string;
  children?: Record<string, Block>;
  attr?: {
    [key: string]: string | number | boolean | undefined;
  };
  events?: {
    [key: string]: (e: Event) => void;
  };
  [key: string]: unknown;
}

export default class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  protected _element: HTMLElement | null = null;

  protected _id: number = Math.floor(100000 + Math.random() * 900000);

  protected props: BlockProps;

  protected children: Record<string, Block>;

  protected lists: Record<string, Block[]>;

  protected eventBus: () => EventBus;

  private eventCallbacks: Map<string, EventCallback> = new Map();

  constructor(propsWithChildren: BlockProps = {}) {
    const eventBus = new EventBus();
    const { props, children, lists } = this._getChildrenPropsAndProps(propsWithChildren);

    this.props = this._makePropsProxy({ ...props });
    this.children = children;
    this.lists = lists;
    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _addEvents(): void {
    const { events = {} } = this.props;
    Object.keys(events).forEach(eventName => {
      if (this._element && events[eventName]) {
        this._element.addEventListener(eventName, events[eventName]);
      }
    });
  }

  private _removeEvents(): void {
    const { events = {} } = this.props;
    Object.keys(events).forEach(eventName => {
      if (this._element && events[eventName]) {
        this._element.removeEventListener(eventName, events[eventName]);
      }
    });
  }

  private _registerEvents(eventBus: EventBus): void {
    const initCallback = this.init.bind(this) as EventCallback;
    const componentDidMountCallback = this._componentDidMount.bind(this) as EventCallback;
    const componentDidUpdateCallback = this._componentDidUpdate.bind(this) as EventCallback;
    const renderCallback = this._render.bind(this) as EventCallback;

    this.eventCallbacks.set(Block.EVENTS.INIT, initCallback);
    this.eventCallbacks.set(Block.EVENTS.FLOW_CDM, componentDidMountCallback);
    this.eventCallbacks.set(Block.EVENTS.FLOW_CDU, componentDidUpdateCallback);
    this.eventCallbacks.set(Block.EVENTS.FLOW_RENDER, renderCallback);

    eventBus.on(Block.EVENTS.INIT, initCallback);
    eventBus.on(Block.EVENTS.FLOW_CDM, componentDidMountCallback);
    eventBus.on(Block.EVENTS.FLOW_CDU, componentDidUpdateCallback);
    eventBus.on(Block.EVENTS.FLOW_RENDER, renderCallback);
  }

  public destroy(): void {
    this._removeEvents();
    this._unregisterEvents();

    Object.values(this.children).forEach(child => {
      if (typeof child.destroy === 'function') {
        child.destroy();
      }
    });

    Object.values(this.lists).forEach(list => {
      list.forEach(item => {
        if (typeof item.destroy === 'function') {
          item.destroy();
        }
      });
    });

    this._element = null;
  }

  private _unregisterEvents(): void {
    const eventBus = this.eventBus();

    this.eventCallbacks.forEach((callback, event) => {
      eventBus.off(event, callback);
    });

    this.eventCallbacks.clear();
  }

  protected off(event: string): void {
    const callback = this.eventCallbacks.get(event);
    if (callback) {
      this.eventBus().off(event, callback);
      this.eventCallbacks.delete(event);
    }
  }

  protected init(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount(): void {
    this.componentDidMount();
    Object.values(this.children).forEach(child => {
      child.dispatchComponentDidMount();
    });
  }

  protected componentDidMount(): void {}

  public dispatchComponentDidMount(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: BlockProps, newProps: BlockProps): void {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  protected componentDidUpdate(oldProps: BlockProps, newProps: BlockProps): boolean {
    console.log(oldProps, newProps);
    return true;
  }

  private _getChildrenPropsAndProps(propsAndChildren: BlockProps): {
    children: Record<string, Block>,
    props: BlockProps,
    lists: Record<string, Block[]>
  } {
    const children: Record<string, Block> = {};
    const props: BlockProps = {};
    const lists: Record<string, Block[]> = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else if (Array.isArray(value) && value.every(item => item instanceof Block)) {
        lists[key] = value;
      } else {
        (props as Record<string, unknown>)[key] = value;
      }
    });

    return { children, props, lists };
  }

  protected addAttributes(): void {
    const { attr = {} } = this.props;
    Object.entries(attr).forEach(([key, value]) => {
      if (this._element && value !== undefined) {
        this._element.setAttribute(key, String(value));
      }
    });
  }

  protected setAttributes(attr: { [key: string]: string | number | boolean }): void {
    Object.entries(attr).forEach(([key, value]) => {
      if (this._element) {
        this._element.setAttribute(key, String(value));
      }
    });
  }

  public setProps = (nextProps: Partial<BlockProps>): void => {
    if (!nextProps) {
      return;
    }
    Object.assign(this.props, nextProps);
  };

  public setLists = (nextList: Record<string, Block[]>): void => {
    if (!nextList) {
      return;
    }
    Object.assign(this.lists, nextList);
  };

  get element(): HTMLElement | null {
    return this._element;
  }

  private _render(): void {
    console.log('Render');
    const propsAndStubs: BlockProps = { ...this.props };
    const tmpId = Math.floor(100000 + Math.random() * 900000);

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    Object.entries(this.lists).forEach(entry => {
      const key = entry[0];
      propsAndStubs[key] = `<div data-id="__l_${tmpId}"></div>`;
    });

    const fragment = this._createDocumentElement('template');
    fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs);

    Object.values(this.children).forEach(child => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      if (stub) {
        stub.replaceWith(child.getContent());
      }
    });

    Object.entries(this.lists).forEach(([, children]) => {
      const listCont = this._createDocumentElement('template');
      children.forEach(item => {
        listCont.content.append(item.getContent());
      });

      const stub = fragment.content.querySelector(`[data-id="__l_${tmpId}"]`);
      if (stub) {
        stub.replaceWith(listCont.content);
      }
    });

    const newElement = fragment.content.firstElementChild as HTMLElement;
    if (this._element && newElement) {
      this._element.replaceWith(newElement);
    }
    this._element = newElement;
    this._addEvents();
    this.addAttributes();
  }

  protected render(): string {
    return '';
  }

  public getContent(): HTMLElement {
    if (!this._element) {
      throw new Error('Element is not created');
    }
    return this._element;
  }

  private _makePropsProxy(props: BlockProps): BlockProps {
    return new Proxy(props, {
      get: (target: BlockProps, prop: string): unknown => {
        const value = target[prop];
        return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(target) : value;
      },

      set: (target: BlockProps, prop: string, value: unknown): boolean => {
        const oldTarget = { ...target };
        target[prop] = value;
        this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },

      deleteProperty: (): never => {
        throw new Error('No access');
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLTemplateElement {
    return document.createElement(tagName) as HTMLTemplateElement;
  }

  public show(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = 'block';
    }
  }

  public hide(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = 'none';
    }
  }
}
