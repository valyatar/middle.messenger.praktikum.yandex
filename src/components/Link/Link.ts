import Block, { BlockProps } from '../../framework/Block';

export interface LinkProps extends BlockProps { // наследуем от BlockProps
  href: string
  class?: string
  datapage?: string
  text: string
  onClick?: (e: Event) => void
}

export default class Link extends Block {
  constructor(props: LinkProps) {
    super({
      ...props,
      events: {
        click: (e: Event) => {
          props.onClick?.(e);
        },
      },
    });
  }

  changeStyles() {
    this.setProps({
      attr: {
        class: '',
      }
    });
  }

  render() {
    return '<a id="{{id}}" href="{{href}}" class="{{class}}" data-page="{{datapage}}">{{text}}</a>';
  }
}