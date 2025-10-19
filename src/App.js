import Handlebars from "handlebars"
import * as Pages from './pages';

import Button from './components/Button/Button';
import Input from "./components/Input/Input";
import Link from "./components/Link/Link";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import Footer from "./components/Footer/Footer";
import Image from "./components/Image/Image";
import Field from "./components/Field/Field";
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('ErrorMessage', ErrorMessage);
Handlebars.registerPartial('Footer', Footer);
Handlebars.registerPartial('Image', Image);
Handlebars.registerPartial('Field', Field);

export default class App {
    constructor() {
        this.state = {
            currentPage: 'authorization',
        };
        this.appElement = document.getElementById('app');
    }

    footerTemplate() {
        const footerTemplate = Handlebars.compile(Footer);
        return footerTemplate({});
    }

    authorizationPageTemplate() {
        const template = Handlebars.compile(Pages.AuthorizationPage);
        return template({});
    }

    registrationPageTemplate() {
        const template = Handlebars.compile(Pages.RegisterPage);
        return template({});
    }

    errorPageTemplate(errorCode) {
        let template = Handlebars.compile(Pages.Error500)

        if (errorCode === 404) {
            template = Handlebars.compile(Pages.Error404);
        }

        return template({});
    }

    chatListPageTemplate() {
        const template = Handlebars.compile(Pages.ChatListPage);
        return template({});
    }

    profilePageTemplate() {
        const template = Handlebars.compile(Pages.ProfilePage);
        return template({});
    }

    changePwdPageTemplate() {
        const template = Handlebars.compile(Pages.ChangePassword);
        return template({});
    }

    render() {
        const {currentPage} = this.state;
        let pageHTML = "";
        switch (currentPage) {
            case 'authorization':
                pageHTML = this.authorizationPageTemplate();
                break;
            case 'registration':
                pageHTML = this.registrationPageTemplate();
                break;
            case 'chatList':
                pageHTML = this.chatListPageTemplate();
                break;
            case 'profileSettings':
                pageHTML = this.profilePageTemplate();
                break;
            case 'changePassword':
                pageHTML = this.changePwdPageTemplate();
                break;
            case 'error404':
                pageHTML = this.errorPageTemplate(404);
                break;
            case 'error500':
                pageHTML = this.errorPageTemplate(500);
                break;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(pageHTML + this.footerTemplate(), "text/html");
        this.appElement.textContent = "";
        this.appElement.append(...doc.body.childNodes);

        this.addEventListeners();
    };

    addEventListeners() {
        const {currentPage} = this.state;
        if (currentPage === 'authorization') {
            const createAccountBtn = document.getElementById("createAccount");
            createAccountBtn.addEventListener('click', () => this.changePage('registration'));
        } else if (currentPage === 'registration') {
            const signInBtn = document.getElementById("signIn");
            signInBtn.addEventListener('click', () => this.changePage('authorization'));
        } else if (currentPage === 'profileSettings') {
            const changePwdBtn = document.getElementById("changePassword");
            changePwdBtn.addEventListener('click', () => this.changePage('changePassword'));
        }

        const footerLinks = document.querySelectorAll('.footer-link');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.changePage(e.target.dataset.page);
            });
        });
    }

    changePage(page) {
        this.state.currentPage = page;
        this.render();
    }
}
