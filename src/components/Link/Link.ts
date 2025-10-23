import Block from '../../framework/Block';

export default class Link extends Block {
  constructor(props: any) {
    super({
      ...props,
      events: {
        click: (e: Event) => {
          // this.changeStyles();
          props.onClick(e);
        },
      },
      // attr: {
      //     // class: 'footer-link',
      // },
    });
  }

  changeStyles() {
    this.setProps({ attr: {
      class: '',
    } });
  }

  render() {
    return '<a id="{{id}}" href="{{href}}" class="{{class}}" data-page="{{datapage}}">{{text}}</a>';
  }
}
