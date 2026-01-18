import Block from '../../../framework/Block';
import { Field } from '../../../components/Field/Field';
import Button from '../../../components/Button/Button';
import { ProfilePageProps } from '../../../types/app';
import { store } from '../../../store/Store';
import { arrowLeftIcon } from '../../../../public/static/icons/arrowLeft';
import { validateForm } from '../../../helpers/validation';

import '../profile.pcss';
import { FormDataMap } from './ChangePasswordPage';

export class ChangeDataPage extends Block<ProfilePageProps> {
  private unsubscribeStore: (() => void) | null;

  constructor(props: ProfilePageProps) {
    const user = store.getState().user;

    const componentProps = {
      EmailField: new Field({
        id: 'email',
        name: 'email',
        label: 'Почта',
        value: user?.email ?? '',
      }),
      LoginField: new Field({
        id: 'login',
        name: 'login',
        label: 'Логин',
        value: user?.login ?? '',
      }),
      FirstNameField: new Field({
        id: 'first_name',
        name: 'first_name',
        label: 'Имя',
        value: user?.first_name ?? '',
      }),
      SecondNameField: new Field({
        id: 'second_name',
        name: 'second_name',
        label: 'Фамилия',
        value: user?.second_name ?? '',
      }),
      DisplayNameField: new Field({
        id: 'display_name',
        name: 'display_name',
        label: 'Имя в чате',
        value: user?.display_name ?? '',
      }),
      PhoneField: new Field({
        id: 'phone',
        name: 'phone',
        label: 'Телефон',
        value: user?.phone ?? '',
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

    this.unsubscribeStore = store.subscribe(() => {
      const nextUser = store.getState().user;

      (this.children.EmailField as unknown as Field).setProps({ value: nextUser?.email ?? '' });
      (this.children.LoginField as unknown as Field).setProps({ value: nextUser?.login ?? '' });
      (this.children.FirstNameField as unknown as Field).setProps({ value: nextUser?.first_name ?? '' });
      (this.children.SecondNameField as unknown as Field).setProps({ value: nextUser?.second_name ?? '' });
      (this.children.DisplayNameField as unknown as Field).setProps({ value: nextUser?.display_name ?? '' });
      (this.children.PhoneField as unknown as Field).setProps({ value: nextUser?.phone ?? '' });
    });
  }

  public destroy(): void {
    this.unsubscribeStore?.();
    this.unsubscribeStore = null;
    super.destroy();
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

    const payload = {
      email: typeof data.email === 'string' ? data.email : '',
      login: typeof data.login === 'string' ? data.login : '',
      first_name: typeof data.first_name === 'string' ? data.first_name : '',
      second_name: typeof data.second_name === 'string' ? data.second_name : '',
      display_name: typeof data.display_name === 'string' ? data.display_name : '',
      phone: typeof data.phone === 'string' ? data.phone : '',
    };

    try {
      const updatedUser = await this.props.app.userController.updateProfile(payload);

      store.set('user', updatedUser);

      alert('Данные профиля сохранены');
      this.props.app.router.go('/settings');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Не удалось обновить данные профиля';
      alert(msg);
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
              {{{ EmailField }}}
              {{{ LoginField }}}
              {{{ FirstNameField }}}
              {{{ SecondNameField }}}
              {{{ DisplayNameField }}}
              {{{ PhoneField }}}
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
