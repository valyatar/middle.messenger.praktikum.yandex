import Handlebars from "handlebars"
import * as Pages from './pages';

import Button from './components/Button';
import Input from "./components/Input";
import Link from "./components/Link";
import ErrorMessage from "./components/ErrorMessage";
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('ErrorMessage', ErrorMessage);

export default class App {
    constructor() {
        this.state = {
            currentPage: 'authorization',
        };
        this.appElement = document.getElementById('app');
    }

    render() {
        let template;
        if (this.state.currentPage === 'authorization') {
            template = Handlebars.compile(Pages.AuthorizationPage);
            this.appElement.innerHTML = template({});
        } else if (this.state.currentPage === 'registration') {
            template = Handlebars.compile(Pages.RegisterPage);
            this.appElement.innerHTML = template({});
        }


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
        }
    }

    changePage(page) {
        this.state.currentPage = page;
        this.render();
    }
}