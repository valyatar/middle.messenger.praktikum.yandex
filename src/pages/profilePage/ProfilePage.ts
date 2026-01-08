import Block from '../../framework/Block';
import { Image } from '../../components/Image/Image';
import { Field } from '../../components/Field/Field';
import Link from '../../components/Link/Link';
import { ProfilePageProps } from '../../types/app';
import Button from '../../components/Button/Button';
import { arrowLeftIcon } from '../../../public/static/icons/arrowLeft';
import { store } from '../../store/Store';
import { RESOURCES_BASE } from '../../services/http/HTTPTransport';

import './profile.pcss';

function getAvatarSrc(avatar: string | null | undefined): string {
  return avatar ? `${RESOURCES_BASE}${avatar}` : '/static/icons/avatar.svg';
}

export class ProfilePage extends Block<ProfilePageProps> {
  private unsubscribeStore: (() => void) | null;

  constructor(props: ProfilePageProps) {
    const user = store.getState().user;
    const avatarSrc = getAvatarSrc(user?.avatar);

    const componentProps = {
      Avatar: new Image({
        size: '120px',
        src: avatarSrc,
        alt: 'Аватар',
        name: 'avatar',
      }),

      EmailField: new Field({
        id: 'email',
        name: 'email',
        label: 'Почта',
        value: user?.email ?? '',
        readonly: true,
      }),
      LoginField: new Field({
        id: 'login',
        name: 'login',
        label: 'Логин',
        value: user?.login ?? '',
        readonly: true,
      }),
      FirstNameField: new Field({
        id: 'first_name',
        name: 'first_name',
        label: 'Имя',
        value: user?.first_name ?? '',
        readonly: true,
      }),
      SecondNameField: new Field({
        id: 'second_name',
        name: 'second_name',
        label: 'Фамилия',
        value: user?.second_name ?? '',
        readonly: true,
      }),
      DisplayNameField: new Field({
        id: 'display_name',
        name: 'display_name',
        label: 'Имя в чате',
        value: user?.display_name ?? '',
        readonly: true,
      }),
      PhoneField: new Field({
        id: 'phone',
        name: 'phone',
        label: 'Телефон',
        value: user?.phone ?? '',
        readonly: true,
      }),

      ChangeDataLink: new Link({
        href: '#',
        datapage: '',
        text: 'Изменить данные',
        onClick: (event: Event) => {
          event.preventDefault();
          props.app.router.go('/settings/userData');
        },
        id: '',
      }),

      ChangePasswordLink: new Link({
        href: '#',
        datapage: 'changePassword',
        text: 'Изменить пароль',
        onClick: (event: Event) => {
          event.preventDefault();
          props.app.router.go('/settings/password');
        },
        id: 'changePassword',
      }),

      ExitLink: new Link({
        href: '#',
        datapage: '',
        text: 'Выйти',
        onClick: (event: Event) => {
          event.preventDefault();

          void this.props.app.authController
            .logout()
            .then(() => {
              store.set('user', null);
              store.set('chats', []);
              store.set('selectedChatId', null);
              store.set('messagesByChatId', {});
              this.props.app.router.go('/');
            })
            .catch(console.error);
        },
        id: '',
      }),

      BackBtn: new Button({
        id: 'backBtn',
        icon: arrowLeftIcon,
        type: 'button',
        events: {
          click: (event: Event) => {
            event.preventDefault();
            props.app.router.go('/messenger');
          },
        },
      }),
      UserName: user?.display_name || user?.first_name || '',

      events: {
        click: (e: Event) => this.onClick(e),
        change: (e: Event) => this.onChange(e),
      },
    };

    super({
      ...componentProps,
      ...props,
    });

    this.unsubscribeStore = store.subscribe(() => {
      const updUser = store.getState().user;
      const avatar = this.children.Avatar as unknown as Image;
      avatar.setProps({ src: getAvatarSrc(updUser?.avatar) });
    });
  }

  public destroy(): void {
    this.unsubscribeStore?.();
    this.unsubscribeStore = null;
    super.destroy();
  }

  private onClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const avatarWrap = target.closest('#avatar');
    if (avatarWrap) {
      const input = document.getElementById('avatarInput') as HTMLInputElement | null;
      input?.click();
    }
  }

  private async onChange(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    if (target.id !== 'avatarInput') return;

    const file = target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Выберите изображение');
      target.value = '';
      return;
    }

    try {
      const ok = await this.props.app.userController.changeAvatar(file);

      if (!ok) {
        alert('Не удалось обновить аватар');
        return;
      }

      const freshUser = await this.props.app.authController.fetchUser();
      store.set('user', freshUser);

      alert('Аватар обновлён');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Не удалось обновить аватар';
      alert(msg);
    } finally {
      target.value = '';
    }
  }

  protected render(): string {
    return `<div class="profile-settings">
      <div class="profile-settings__left">
        {{{ BackBtn }}}
      </div>

      <div class="profile-settings__right">
        <div id="avatar" name="avatar" class="img-centered" style="cursor: pointer;">
          {{{ Avatar }}}
        </div>

        <input id="avatarInput" type="file" accept="image/*" style="display:none;" />

        <h2>{{{ UserName }}}</h2>

        <div>
          {{{ EmailField }}}
          {{{ LoginField }}}
          {{{ FirstNameField }}}
          {{{ SecondNameField }}}
          {{{ DisplayNameField }}}
          {{{ PhoneField }}}
        </div>

        <div class="profile-settings__actions">
          {{{ ChangeDataLink }}}
          {{{ ChangePasswordLink }}}
          {{{ ExitLink }}}
        </div>
      </div>
    </div>`;
  }
}
