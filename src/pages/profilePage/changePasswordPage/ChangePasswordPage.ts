import Block from '../../../framework/Block';
import { Field } from '../../../components/Field/FIeld';
import { Image } from '../../../components/Image/Image';
import Button from '../../../components/Button/Button';
import { validateForm } from '../../../helpers/validation';
import { UserService } from '../../../services/UserService';

import '../profile.pcss';

export class ChangePasswordPage extends Block {
  private userService: UserService;

  constructor() {
    super({
      Avatar: new Image({
        size: '120px',
        src: '/static/icons/avatar.svg',
        name: 'avatar',
      }),
      OldPasswordField: new Field({
        id: 'oldPassword',
        name: 'oldPassword',
        label: 'Старый пароль',
        value: '***',
      }),
      NewPasswordField: new Field({
        id: 'newPassword',
        name: 'newPassword',
        label: 'Новый пароль',
        value: '***',
      }),
      RepeatNewPasswordField: new Field({
        id: 'repeatNewPassword',
        name: 'repeatNewPassword',
        label: 'Повторите новый пароль',
        value: '***',
      }),
      SaveBtn: new Button({
        id: 'saveBtn',
        text: 'Сохранить',
        type: 'submit',
      }),
      events: {
        submit: (e: Event) => this.handleSubmit(e),
      },
    });

    this.userService = new UserService();
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const validationResult = validateForm(form);

    if (!validationResult.isValid) {
      console.log('Ошибка валидации');
      return;
    }

    console.log('Данные со страницы смены пароля:', validationResult.data);
  }

  render(): string {
    return `<main class="change-pwd">
              <form>
                <div id="avatar" name="avatar" class="img-centered">
                  {{{ Avatar }}}
                </div>
                <div>
                  {{{ OldPasswordField }}}
                  {{{ NewPasswordField }}}
                  {{{ RepeatNewPasswordField }}}
                </div>
                <div class="change-pwd__actions">
                  {{{ SaveBtn }}}
                </div>
              </form>
            </main>`;
  }
}
