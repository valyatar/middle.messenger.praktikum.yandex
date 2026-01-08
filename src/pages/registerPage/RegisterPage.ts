import Block from '../../framework/Block';
import Link from '../../components/Link/Link';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { validateForm } from '../../helpers/validation';
import { RegisterPageProps } from '../../types/app';
import { initAfterAuth } from '../../helpers/initAfterAuth';

export class RegisterPage extends Block<RegisterPageProps> {
  constructor(props: RegisterPageProps) {
    const componentProps = {
      EmailInput: new Input({
        id: 'email',
        name: 'email',
        type: 'text',
        placeholder: 'Почта',
      }),
      LoginInput: new Input({
        id: 'login',
        name: 'login',
        type: 'text',
        placeholder: 'Логин',
      }),
      FirstNameInput: new Input({
        id: 'first_name',
        name: 'first_name',
        type: 'text',
        placeholder: 'Имя',
      }),
      SecondNameInput: new Input({
        id: 'second_name',
        name: 'second_name',
        type: 'text',
        placeholder: 'Фамилия',
      }),
      PhoneInput: new Input({
        id: 'phone',
        name: 'phone',
        type: 'tel',
        placeholder: 'Телефон',
      }),
      PasswordInput: new Input({
        id: 'password',
        name: 'password',
        type: 'password',
        placeholder: 'Пароль',
      }),
      PasswordCheckInput: new Input({
        id: 'password_check',
        name: 'password_check',
        type: 'password',
        placeholder: 'Пароль (еще раз)',
      }),
      RegistrationBtn: new Button({
        id: 'register-button',
        text: 'Зарегистрироваться',
        type: 'submit',
      }),
      SignInLink: new Link({
        href: '/',
        text: 'Войти?',
        onClick: (event: Event) => {
          event.preventDefault();
          props.app.router.go('/');
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

    const payload = {
      email: typeof data.email === 'string' ? data.email : '',
      login: typeof data.login === 'string' ? data.login : '',
      first_name: typeof data.first_name === 'string' ? data.first_name : '',
      second_name: typeof data.second_name === 'string' ? data.second_name : '',
      phone: typeof data.phone === 'string' ? data.phone : '',
      password: typeof data.password === 'string' ? data.password : '',
    };

    void this.props.app.authController
      .register(payload)
      .then((ok) => {
        if (!ok) {
          alert('Не удалось зарегистрироваться');
          return;
        }
        return initAfterAuth(this.props.app);
      })
      .then(() => {
        this.props.app.router.go('/messenger');
      })
      .catch((error: unknown) => {
        const msg = error instanceof Error ? error.message : 'Ошибка регистрации';
        alert(msg);
      });
  }

  render(): string {
    return `<div class="register">
              <form>
                <h2>Регистрация</h2>
                {{{ EmailInput }}}
                {{{ LoginInput }}}
                {{{ FirstNameInput }}}
                {{{ SecondNameInput }}}
                {{{ PhoneInput }}}
                {{{ PasswordInput }}}
                {{{ PasswordCheckInput }}}
                {{{ RegistrationBtn }}}
                {{{ SignInLink }}}
              </form>
            </div>`;
  }
}
