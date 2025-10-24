import Block, { BlockProps } from '../../framework/Block';

export interface ErrorMessageProps extends BlockProps {
  message: string;
}

export default class ErrorMessage extends Block<ErrorMessageProps> {
  constructor(props: ErrorMessageProps) {
    super({
      ...props,
    });
  }

  render() {
    return '<p class="error">{{message}}</p>';
  }
}
