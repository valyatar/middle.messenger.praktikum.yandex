import Block from '../../framework/Block';
import Link from '../../components/Link/Link';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { validateForm } from '../../helpers/validation';
import { RegisterPageProps, RegisterData } from '../../types/app';

function getStringField(data: Record<string, unknown>, key: string): string | null {
  const value = data[key];
  return typeof value === 'string' ? value : null;
}

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

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const validationResult = validateForm(form);

    if (!validationResult.isValid) {
      console.log('Ошибка валидации');
      return;
    }

    const data = validationResult.data as Record<string, unknown>;

    const payload: RegisterData = {
      email: getStringField(data, 'email') ?? '',
      login: getStringField(data, 'login') ?? '',
      first_name: getStringField(data, 'first_name') ?? '',
      second_name: getStringField(data, 'second_name') ?? '',
      phone: getStringField(data, 'phone') ?? '',
      password: getStringField(data, 'password') ?? '',
    };

    const passwordCheck = getStringField(data, 'password_check');
    if (passwordCheck !== null && passwordCheck !== payload.password) {
      alert('Пароли не совпадают');
      return;
    }

    const ok = await this.props.app.authController.register(payload);

    if (!ok) {
      alert('Не удалось зарегистрироваться. Проверьте данные.');
    }
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
