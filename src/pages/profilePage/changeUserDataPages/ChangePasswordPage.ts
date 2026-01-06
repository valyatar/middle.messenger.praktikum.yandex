import Block from '../../../framework/Block';
import { Field } from '../../../components/Field/Field';
import Button from '../../../components/Button/Button';
import { validateForm } from '../../../helpers/validation';
import { ChangePasswordPageProps } from '../../../types/app';

import '../profile.pcss';
import { arrowLeftIcon } from '../../../../public/static/icons/arrowLeft';

type FormDataMap = Record<string, unknown>;

export class ChangePasswordPage extends Block<ChangePasswordPageProps> {
  constructor(props: ChangePasswordPageProps) {
    const componentProps = {
      OldPasswordField: new Field({
        id: 'oldPassword',
        name: 'oldPassword',
        label: 'Старый пароль',
        placeholder: 'Введите старый пароль',
        value: '',
      }),
      NewPasswordField: new Field({
        id: 'newPassword',
        name: 'newPassword',
        label: 'Новый пароль',
        placeholder: 'Введите новый пароль',
        value: '',
      }),
      RepeatNewPasswordField: new Field({
        id: 'repeatNewPassword',
        name: 'repeatNewPassword',
        label: 'Повторите новый пароль',
        placeholder: 'Введите новый пароль',
        value: '',
      }),
      SaveBtn: new Button({
        id: 'saveBtn',
        text: 'Сохранить',
        type: 'submit',
      }),
      BackBtn: new Button({
        id: 'backBtn',
        icon: arrowLeftIcon,
        type: 'button',
        events: {
          click: (event: Event) => {
            event.preventDefault();
            props.app.router.go('/settings');
          },
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
      alert('Проверьте корректность заполнения формы');
      return;
    }

    const data = validationResult.data as FormDataMap;

    const oldPassword =
      typeof data.oldPassword === 'string' ? data.oldPassword : '';
    const newPassword =
      typeof data.newPassword === 'string' ? data.newPassword : '';
    const repeatNewPassword =
      typeof data.repeatNewPassword === 'string'
        ? data.repeatNewPassword
        : '';

    if (!oldPassword || !newPassword) {
      alert('Все поля обязательны');
      return;
    }

    if (newPassword !== repeatNewPassword) {
      alert('Новые пароли не совпадают');
      return;
    }

    try {
      await this.props.app.userController.changePassword({
        oldPassword,
        newPassword,
      });

      alert('Пароль успешно изменён');

      this.props.app.router.go('/settings');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось изменить пароль';

      alert(message);
    }
  }

  render(): string {
    return `<div class="profile-settings">
                <div class="profile-settings__left">
                    {{{ BackBtn }}}
                </div>

                <div class="profile-settings__right">
                    <div class="change-pwd">
                        <form>
                            <div>
                                {{{ OldPasswordField }}}
                                {{{ NewPasswordField }}}
                                {{{ RepeatNewPasswordField }}}
                            </div>
                            <div class="change-pwd__actions">
                                {{{ SaveBtn }}}
                            </div>
                        </form>
                    </div>
                </div>
            </div>`;
  }
}
