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
        type: '',
        placeholder: 'Логин',
      }),
      PasswordInput: new Input({
        id: 'password',
        name: 'password',
        type: '',
        placeholder: 'Пароль',
      }),
      AuthorizationBtn: new Button({
        id: 'authBtn',
        text: 'Авторизоваться',
      }),
      CreateAccountLink: new Link({
        href: '#',
        datapage: 'registration',
        text: 'Нет аккаунта?',
        onClick: (event: Event) => {
          console.log('CLICK');
          event.preventDefault();
          event.stopPropagation();
        },
        id: 'createAccount',
      }),
    });
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
