import Block from '../../framework/Block';
import { Image } from '../../components/Image/Image';
import { Field } from '../../components/Field/FIeld';
import Link from '../../components/Link/Link';
import { ProfilePageProps } from '../../types/app';

import './profile.pcss';

export class ProfilePage extends Block {
  constructor(props: ProfilePageProps) {
    super({
      Avatar: new Image({
        size:'120px',
        src:'/static/icons/avatar.svg',
        name:'avatar',
      }),
      EmailField: new Field({
        id: 'email',
        name: 'email',
        label: 'Почта',
        value: 'mail@yandex.ru',
        readonly: true,
      }),
      LoginField: new Field({
        id: 'login',
        name: 'login',
        label: 'Логин',
        value: 'valyatar',
        readonly: true,
      }),
      FirstNameField: new Field({
        id: 'first_name',
        name: 'first_name',
        label: 'Имя',
        value: 'Valya',
        readonly: true,
      }),
      SecondNameField: new Field({
        id: 'second_name',
        name: 'second_name',
        label: 'Фамилия',
        value: 'Tarasova',
        readonly: true,
      }),
      DisplayNameField: new Field({
        id: 'display_name',
        name: 'display_name',
        label: 'Имя в чате',
        value: 'valya',
        readonly: true,
      }),
      PhoneField: new Field({
        id: 'phone',
        name: 'phone',
        label: 'Телефон',
        value: '88008888888',
        readonly: true,
      }),
      ChangeDataLink: new Link({
        href: '#',
        datapage: '',
        text: 'Изменить данные',
        onClick: (event: Event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        id: '',
      }),
      ChangePasswordLink: new Link({
        href: '#',
        datapage: 'changePassword',
        text: 'Изменить пароль',
        onClick: (event: Event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        id: 'changePassword',
      }),
      ExitLink: new Link({
        href: '#',
        datapage: '',
        text: 'Выйти',
        onClick: (event: Event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        id: '',
      }),
    });

    this.props = props;
  }

  render(): string {
    return `<main class="profile-settings">
    <div id="avatar" name="avatar" class="img-centered">
        {{{ Avatar }}}
    </div>
    <h2>Валентина</h2>
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
</main>`;
  }
}
