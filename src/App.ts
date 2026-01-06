import Router from './router/Router';

import { AuthorizationPage } from './pages/authorizationPage/AuthorizationPage';
import { RegisterPage } from './pages/registerPage/RegisterPage';
import { ChatListPage } from './pages/chatListPage/ChatListPage';
import { ProfilePage } from './pages/profilePage/ProfilePage';
import { ChangePasswordPage } from './pages/profilePage/changeUserDataPages/ChangePasswordPage';
import ErrorPage404 from './pages/errorPages/error404/ErrorPage404';
import ErrorPage500 from './pages/errorPages/error500/ErrorPage500';

import { AuthService } from './services/AuthService';
import { UserService } from './services/UserService';
import { ChatsService } from './services/ChatsService';
import { AuthController } from './controllers/AuthController';
import { UserController } from './controllers/UserController';
import { ChatController } from './controllers/ChatController';

import { AppWithControllers } from './types/app';
import { ChangeDataPage } from './pages/profilePage/changeUserDataPages/ChangeDataPage';

export default class App implements AppWithControllers {
  private appElement: HTMLElement | null;

  private readonly pageContainer: HTMLElement;

  public authController: AuthController;

  public userController: UserController;

  public chatController: ChatController;

  public router: Router;

  constructor() {
    this.appElement = document.getElementById('app');

    this.pageContainer = document.createElement('main');
    this.pageContainer.id = 'page';

    this.appElement?.appendChild(this.pageContainer);

    this.router = new Router('#page');

    this.initializeMVC();
  }

  private initializeMVC() {
    const authService = new AuthService();
    const userService = new UserService();
    const chatService = new ChatsService();

    this.authController = new AuthController(authService, this.router);
    this.userController = new UserController(userService);
    this.chatController = new ChatController(chatService);
  }

  public async render() {
    this.router
      .use('/', AuthorizationPage, { app: this })
      .use('/sign-up', RegisterPage, { app: this })
      .use('/settings', ProfilePage, { app: this })
      .use('/messenger', ChatListPage, { app: this })
      .use('/settings/password', ChangePasswordPage, { app: this })
      .use('/settings/userData', ChangeDataPage, { app: this })
      .use('/404', ErrorPage404, { app: this })
      .use('/500', ErrorPage500, { app: this });

    const isAuth = await this.authController.checkAuth();

    const publicRoutes = new Set<string>(['/', '/sign-up']);
    const pathname = window.location.pathname;

    if (!isAuth && !publicRoutes.has(pathname)) {
      window.history.replaceState({}, '', '/');
    }
    this.router.start();
  }
}
