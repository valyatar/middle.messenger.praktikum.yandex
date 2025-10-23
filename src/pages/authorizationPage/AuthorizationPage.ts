import Block from '../../framework/Block';
import Link from '../../components/Link/Link';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

export class AuthorizationPage extends Block {
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
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        data[key] = value;
      } else {
        data[key] = String(value);
      }
    }

    console.log('Данные со страницы авторизации:', data);
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
