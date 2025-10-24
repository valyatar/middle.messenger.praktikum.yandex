import Block from '../../../framework/Block';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import { ErrorPageProps } from '../../../types/app';

export default class ErrorPage404 extends Block<ErrorPageProps> {
  constructor(props: ErrorPageProps) {
    super({
      ErrorMessage: new ErrorMessage({
        message: 'Ошибка 404',
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
