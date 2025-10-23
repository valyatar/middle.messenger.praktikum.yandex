import { AuthorizationPage } from './pages/authorizationPage/AuthorizationPage';
import Footer from './components/Footer/Footer';
import { RegisterPage } from './pages/registerPage/RegisterPage';
import { ChatListPage } from './pages/chatListPage/ChatListPage';
import { ProfilePage } from './pages/profilePage/ProfilePage';
import { ChangePasswordPage } from './pages/profilePage/changePasswordPage/ChangePasswordPage';
import ErrorPage404 from './pages/errorPages/error404/ErrorPage404';
import ErrorPage500 from './pages/errorPages/error500/ErrorPage500';

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

  render() {
    const { currentPage } = this.state;
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

    this.pageContainer.innerHTML = '';
    this.pageContainer.appendChild(pageHTML.getContent());

    this.addEventListeners();
  }

  addEventListeners() {
    const { currentPage } = this.state;
    if (currentPage === 'authorization') {
      const createAccountBtn = document.getElementById('createAccount');
      createAccountBtn?.addEventListener('click', () => this.changePage('registration'));
    } else if (currentPage === 'registration') {
      const signInBtn = document.getElementById('signIn');
      signInBtn?.addEventListener('click', () => this.changePage('authorization'));
    } else if (currentPage === 'profileSettings') {
      const changePwdBtn = document.getElementById('changePassword');
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
