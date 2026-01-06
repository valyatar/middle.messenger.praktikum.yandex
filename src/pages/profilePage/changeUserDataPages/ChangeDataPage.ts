import Block from '../../../framework/Block';
import { Field } from '../../../components/Field/Field';
import Button from '../../../components/Button/Button';
import { ChangePasswordPageProps, ProfilePageProps } from '../../../types/app';

import '../profile.pcss';
import { arrowLeftIcon } from '../../../../public/static/icons/arrowLeft';
import { validateForm } from '../../../helpers/validation';

type FormDataMap = Record<string, unknown>;

export class ChangeDataPage extends Block<ProfilePageProps> {
  constructor(props: ChangePasswordPageProps) {
    const user = props.app.authController.getCurrentUser();
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

      localStorage.setItem('user', JSON.stringify(updatedUser));

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
                            <div id="avatar" name="avatar" class="img-centered">
                                {{{ Avatar }}}
                            </div>

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
