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
                onClick: function (this: Footer, event) {
                    console.log('→ Авторизация');
                },
            },
            {
                name: 'RegistrationLink',
                datapage: 'registration',
                text: 'Регистрация',
                onClick: function (this: Footer, event) {
                    console.log('→ Регистрация');
                },
            },
            {
                name: 'ChatListLink',
                datapage: 'chatList',
                text: 'Список чатов',
                onClick: function (this: Footer, event) {
                    console.log('→ Список чатов');
                },
            },
            {
                name: 'ProfileSettingsLink',
                datapage: 'profileSettings',
                text: 'Настройки пользователя',
                onClick: function (this: Footer, event) {
                    console.log('→ Настройки профиля');
                },
            },
            {
                name: 'ErrorLink404',
                datapage: 'error404',
                text: '404',
                onClick: function (this: Footer, event) {
                    console.log('→ Ошибка 404');
                },
            },
            {
                name: 'ErrorLink500',
                datapage: 'error500',
                text: '500',
                onClick: function (this: Footer, event) {
                    console.log('→ Ошибка 500');
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
								</li>`
            )
            .join('')}
					</ul>
				</nav>
			</footer>
		`;
    }
}
