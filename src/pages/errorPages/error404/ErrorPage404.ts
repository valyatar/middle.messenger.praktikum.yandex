import Block from '../../../framework/Block';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';

export default class ErrorPage404 extends Block {
  constructor() {
    super({
      ErrorMessage: new ErrorMessage({
        message: 'Ошибка 404',
      }),
    });
  }

  render() {
    return `<main className="error-page">
    {{{ ErrorMessage }}}
</main>`;
  }
}
