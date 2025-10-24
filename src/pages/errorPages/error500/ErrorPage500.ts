import Block from '../../../framework/Block';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import { ErrorPageProps } from '../../../types/app';

export default class ErrorPage500 extends Block {
  constructor(props: ErrorPageProps) {
    super({
      ErrorMessage: new ErrorMessage({
        message: 'Ошибка 500',
      }),
    });
    this.props = props;
  }

  render() {
    return `<main className="error-page">
        {{{ ErrorMessage }}}
    </main>`;
  }
}
