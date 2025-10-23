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
      },
      {
        name: 'RegistrationLink',
        datapage: 'registration',
        text: 'Регистрация',
      },
      {
        name: 'ChatListLink',
        datapage: 'chatList',
        text: 'Список чатов',
      },
      {
        name: 'ProfileSettingsLink',
        datapage: 'profileSettings',
        text: 'Настройки пользователя',
      },
      {
        name: 'ErrorLink404',
        datapage: 'error404',
        text: '404',
      },
      {
        name: 'ErrorLink500',
        datapage: 'error500',
        text: '500',
      },
    ];

    const props: BlockProps = {};

    linksData.forEach(({ name, datapage, text, onClick }) => {
      props[name] = new Link({
        href: '#',
        datapage,
        text,
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
