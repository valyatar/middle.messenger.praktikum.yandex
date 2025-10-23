import Block from '../../framework/Block';
import Link from '../../components/Link/Link';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

export class RegisterPage extends Block {
  constructor() {
    super({
      EmailInput: new Input({
        id: 'email',
        name: 'email',
        type: '',
        placeholder: 'Почта',
      }),
      LoginInput: new Input({
        id: 'login',
        name: 'login',
        type: '',
        placeholder: 'Логин',
      }),
      FirstNameInput: new Input({
        id: 'first_name',
        name: 'first_name',
        type: '',
        placeholder: 'Имя',
      }),
      SecondNameInput: new Input({
        id: 'second_name',
        name: 'second_name',
        type: '',
        placeholder: 'Фамилия',
      }),
      PhoneInput: new Input({
        id: 'phone',
        name: 'phone',
        type: '',
        placeholder: 'Телефон',
      }),
      PasswordInput: new Input({
        id: 'password',
        name: 'password',
        type: '',
        placeholder: 'Пароль',
      }),
      PasswordCheckInput: new Input({
        id: 'password_check',
        name: 'password_check',
        type: '',
        placeholder: 'Пароль (еще раз)',
      }),
      RegistrationBtn: new Button({
        id: 'register-button',
        text: 'Зарегистрироваться',
      }),
      SignInLink: new Link({
        href: '#',
        datapage: 'authorization',
        text: 'Войти?',
        onClick: (event: Event) => {
          console.log('CLICK');
          event.preventDefault();
          event.stopPropagation();
        },
        id: 'signIn',
      }),
    });
  }

  render(): string {
    return `<main className="register">
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
</main>`;
  }
}