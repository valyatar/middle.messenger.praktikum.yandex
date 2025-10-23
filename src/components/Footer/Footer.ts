import Block, { BlockProps } from '../../framework/Block';
import Link from '../Link/Link';

import './footer.pcss';

export default class Footer extends Block {
  constructor() {
    const linksData = [
      {
        name: 'AuthorizationLink',
        datapage: 'authorization',
        text: 'Авторизация',
        onClick: (event: Event) => {
          console.log(event);
        },
      },
      {
        name: 'RegistrationLink',
        datapage: 'registration',
        text: 'Регистрация',
        onClick: (event: Event) => {
          console.log(event);
        },
      },
      {
        name: 'ChatListLink',
        datapage: 'chatList',
        text: 'Список чатов',
        onClick: (event: Event) => {
          console.log(event);
        },
      },
      {
        name: 'ProfileSettingsLink',
        datapage: 'profileSettings',
        text: 'Настройки пользователя',
        onClick: (event: Event) => {
          console.log(event);
        },
      },
      {
        name: 'ErrorLink404',
        datapage: 'error404',
        text: '404',
        onClick: (event: Event) => {
          console.log(event);
        },
      },
      {
        name: 'ErrorLink500',
        datapage: 'error500',
        text: '500',
        onClick: (event: Event) => {
          console.log(event);
        },
      },
    ];

    const props: BlockProps = {};

    linksData.forEach(({ name, datapage, text, onClick }) => {
      props[name] = new Link({
        href: '#',
        datapage,
        text,
        onClick: (event: Event) => onClick(event),
        attr: { class: 'footer-link' },
      });
    });

    super(props);
  }

  render() {
    const linkNames = [
      'AuthorizationLink',
      'RegistrationLink',
      'ChatListLink',
      'ProfileSettingsLink',
      'ErrorLink404',
      'ErrorLink500',
    ];

    return `
      <footer class="footer">
    <nav class="footer__nav" aria-label="Навигация по сайту">
      <ul class="footer__list">
        ${linkNames.map((name) => `
          <li class="footer__item">
            {{{ ${name} }}}
          </li>`).join('')}
      </ul>
    </nav>
    </footer>
  `;
  }
}
