import Block from '../../framework/Block';

export default class ErrorMessage extends Block {
  constructor(props: any) {
    super({
      ...props,
    });
  }

  render() {
    return '<p class="error">{{message}}</p>';
  }
}