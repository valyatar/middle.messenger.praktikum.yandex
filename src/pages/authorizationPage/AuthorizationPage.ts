import Block from '../../framework/Block';
import Link from '../../components/Link/Link';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { validateForm } from '../../helpers/validation';
import { AuthorizationPageProps } from '../../types/app';
import { initAfterAuth } from '../../helpers/initAfterAuth';

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

  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const validationResult = validateForm(form);

    if (!validationResult.isValid) {
      alert('Ошибка валидации');
      return;
    }

    const data = validationResult.data as Record<string, unknown>;
    const login = typeof data.login === 'string' ? data.login : '';
    const password = typeof data.password === 'string' ? data.password : '';

    void this.props.app.authController
      .login(login, password)
      .then((ok) => {
        if (!ok) {
          alert('Неверный логин или пароль');
          return;
        }
        return initAfterAuth(this.props.app);
      })
      .then(() => {
        this.props.app.router.go('/messenger');
      })
      .catch((error: unknown) => {
        const msg = error instanceof Error ? error.message : 'Ошибка авторизации';
        alert(msg);
      });
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
