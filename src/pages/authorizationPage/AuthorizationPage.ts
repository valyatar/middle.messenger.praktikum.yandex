import Block from '../../framework/Block';
import Link from '../../components/Link/Link';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { validateForm } from '../../helpers/validation';
import { AuthorizationPageProps } from '../../types/app';

function getStringField(data: Record<string, unknown>, key: string): string | null {
  const value = data[key];
  return typeof value === 'string' ? value : null;
}

export class AuthorizationPage extends Block<AuthorizationPageProps> {
  constructor(props: AuthorizationPageProps) {
    const componentProps = {
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
        href: '/sign-up',
        text: 'Нет аккаунта?',
        onClick: (event: Event) => {
          event.preventDefault();
          props.app.router.go('/sign-up');
        },
      }),
      events: {
        submit: (e: Event) => this.handleSubmit(e),
      },
    };

    super({
      ...componentProps,
      ...props,
    });
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const validationResult = validateForm(form);

    if (!validationResult.isValid) {
      console.log('Ошибка валидации');
      return;
    }

    const data = validationResult.data as Record<string, unknown>;
    const login = getStringField(data, 'login');
    const password = getStringField(data, 'password');

    if (!login || !password) {
      console.log('Не удалось получить login/password из формы');
      return;
    }

    const ok = await this.props.app.authController.login(login, password);

    if (!ok) {
      alert('Неверный логин или пароль');
    }
  }

  render(): string {
    return `<div class="authorization">
              <form>
                <h2>Вход</h2>
                {{{ LoginInput }}}
                {{{ PasswordInput }}}
                {{{ AuthorizationBtn }}}
                {{{ CreateAccountLink }}}
              </form>
            </div>`;
  }
}
