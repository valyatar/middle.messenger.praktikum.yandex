import Block from '../../framework/Block';
import Link from '../../components/Link/Link';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { validateForm } from '../../helpers/validation';
import { AuthService } from '../../services/AuthService';

export class AuthorizationPage extends Block {
  private authService: AuthService;

  constructor() {
    super({
      LoginInput: new Input({
        id: 'login',
        name: 'login',
        type: 'text',
        placeholder: 'Логин',
      }),
      PasswordInput: new Input({
        id: 'password',
        name: 'password',
        type: 'password',
        placeholder: 'Пароль',
      }),
      AuthorizationBtn: new Button({
        id: 'authBtn',
        text: 'Авторизоваться',
        type: 'submit',
      }),
      CreateAccountLink: new Link({
        href: '#',
        datapage: 'registration',
        text: 'Нет аккаунта?',
        onClick: (event: Event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        id: 'createAccount',
      }),
      events: {
        submit: (e: Event) => this.handleSubmit(e),
      },
    });

    this.authService = new AuthService();
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const validationResult = validateForm(form);

    if (!validationResult.isValid) {
      console.log('Ошибка валидации');
      return;
    }

    console.log('Данные со страницы авторизации:', validationResult.data);
  }

  render(): string {
    return `<main class="authorization">
              <form>
                <h2>Вход</h2>
                {{{ LoginInput }}}
                {{{ PasswordInput }}}
                {{{ AuthorizationBtn }}}
                {{{ CreateAccountLink }}}
              </form>
            </main>`;
  }
}
