import Block from '../../framework/Block';
import Link from '../Link/Link';
import './footer.pcss';

export default class Footer extends Block {
  constructor() {
    const linksData = [
      {
        name: 'AuthorizationLink',
        datapage: 'authorization',
        text: 'Авторизация',
        onClick:  (event) => {
          console.log(event);
        },
      },
      {
        name: 'RegistrationLink',
        datapage: 'registration',
        text: 'Регистрация',
        onClick: (event) => {
          console.log(event);
        },
      },
      {
        name: 'ChatListLink',
        datapage: 'chatList',
        text: 'Список чатов',
        onClick: (event) => {
          console.log(event);
        },
      },
      {
        name: 'ProfileSettingsLink',
        datapage: 'profileSettings',
        text: 'Настройки пользователя',
        onClick: (event) => {
          console.log(event);
        },
      },
      {
        name: 'ErrorLink404',
        datapage: 'error404',
        text: '404',
        onClick: (event) => {
          console.log(event);
        },
      },
      {
        name: 'ErrorLink500',
        datapage: 'error500',
        text: '500',
        onClick: (event) => {
          console.log(event);
        },
      },
    ];

    const children: Record<string, Block> = {};

    linksData.forEach(({ name, datapage, text, onClick }) => {
      children[name] = new Link({
        href: '#',
        datapage,
        text,
        onClick: (event) => onClick.call(this, event),
        attr: { class: 'footer-link' },
      });
    });

    super({
      ...children,
    });
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
						${linkNames
    .map(
      (name) => `
								<li class="footer__item">
									{{{ ${name} }}}
								</li>`,
    )
    .join('')}
					</ul>
				</nav>
			</footer>
		`;
  }
}
