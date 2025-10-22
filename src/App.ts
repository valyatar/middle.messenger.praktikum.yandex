import Handlebars from "handlebars"
import * as Pages from './pages';

import Button from './components/Button/_OLD_Button';
import Input from "./components/Input/_OLD_Input";
// import Link from "./components/Link/Link";
import ErrorMessage from "./components/ErrorMessage/_OLD_ErrorMessage";
// import Footer from "./components/Footer/Footer";
import Image from "./components/Image/_OLD_Image";
import Field from "./components/Field/_OLD_Field";
import {AuthorizationPage} from "./pages/authorizationPage/AuthorizationPage";
import Footer from "./components/Footer/Footer";
import {RegisterPage} from "./pages/registerPage/RegisterPage";
import Block from "./framework/Block";
import {ChatListPage} from "./pages/chatListPage/ChatListPage";
import {ProfilePage} from "./pages/profilePage/ProfilePage";
import {ChangePasswordPage} from "./pages/profilePage/changePasswordPage/ChangePasswordPage";
import ErrorPage404 from "./pages/errorPages/error404/ErrorPage404";
import ErrorPage500 from "./pages/errorPages/error500/ErrorPage500";
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Input', Input);
// Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('ErrorMessage', ErrorMessage);
// Handlebars.registerPartial('Footer', Footer);
Handlebars.registerPartial('Image', Image);
Handlebars.registerPartial('Field', Field);

interface AppState {
    currentPage: string;
}

export default class App {
    private appElement: HTMLElement | null;
    private state: AppState;
    private footer: Footer;
    private pageContainer: HTMLElement;

    constructor() {
        this.state = {
            currentPage: 'authorization',
        };
        this.appElement = document.getElementById('app');
        this.footer = new Footer();

        this.pageContainer = document.createElement('main');
        this.pageContainer.id = 'page';

        this.appElement?.appendChild(this.pageContainer);
        this.appElement?.appendChild(this.footer.getContent());
    }

    // footerTemplate() {
    //     const footerTemplate = new Footer();
    //     return footerTemplate;
    // }

    authorizationPageTemplate() {
        const authorizationPage = new AuthorizationPage();
        console.log(authorizationPage.getContent());
        return authorizationPage;
    }

    registrationPageTemplate() {
        const template = new RegisterPage();
        console.log(template.getContent());
        return template;
    }
    //
    // errorPageTemplate(errorCode) {
    //     let template = Handlebars.compile(Pages.Error500)
    //
    //     if (errorCode === 404) {
    //         template = Handlebars.compile(Pages.Error404);
    //     }
    //
    //     return template({});
    // }
    //
    chatListPageTemplate() {
        const template = new ChatListPage();
        return template;
    }
    //
    profilePageTemplate() {
        const template = new ProfilePage();
        return template;
    }
    //
    // changePwdPageTemplate() {
    //     const template = Handlebars.compile(Pages.ChangePassword);
    //     return template({});
    // }

    render() {
        const {currentPage} = this.state;
        let pageHTML;
        switch (currentPage) {
            case 'authorization':
                pageHTML = new AuthorizationPage();
                break;
            case 'registration':
                pageHTML = new RegisterPage();
                break;
            case 'chatList':
                pageHTML = new ChatListPage();
                break;
            case 'profileSettings':
                pageHTML = new ProfilePage();
                break;
            case 'changePassword':
                pageHTML = new ChangePasswordPage();
                break;
            case 'error404':
                pageHTML = new ErrorPage404();
                break;
            case 'error500':
                pageHTML = new ErrorPage500();
                break;
        }

        // const parser = new DOMParser();
        // const doc = parser.parseFromString(pageHTML, "text/html");
        // this.appElement.textContent = "";
        // this.appElement.append(...doc.body.childNodes);
        //

        // по возможности подсовывать свое значение, а не менять целиком
        this.pageContainer.innerHTML = '';
        this.pageContainer.appendChild(pageHTML.getContent());

        this.addEventListeners();
    };

    addEventListeners() {
        const {currentPage} = this.state;
        if (currentPage === 'authorization') {
            const createAccountBtn = document.getElementById("createAccount");
            createAccountBtn?.addEventListener('click', () => this.changePage('registration'));
        } else if (currentPage === 'registration') {
            const signInBtn = document.getElementById("signIn");
            signInBtn?.addEventListener('click', () => this.changePage('authorization'));
        } else if (currentPage === 'profileSettings') {
            const changePwdBtn = document.getElementById("changePassword");
            changePwdBtn?.addEventListener('click', () => this.changePage('changePassword'));
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
