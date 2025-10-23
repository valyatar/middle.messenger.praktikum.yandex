import Block, {BlockProps} from '../../framework/Block';

export interface InputProps extends BlockProps {
  name: string
  type?: string
  placeholder?: string
  value?: string
  onClick?: (e: Event) => void
}

export default class Input extends Block {
  constructor(props: InputProps) {
    super({
      ...props,
      events: {
        click: (e: Event) => {
          // this.changeStyles();
          props.onClick?.(e);
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
    return '<input name="{{name}}" type="{{type}}" placeholder="{{placeholder}}" value="{{value}}" class="input">';
  }
}
