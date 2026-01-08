import Router from './router/Router';

import { AuthorizationPage } from './pages/authorizationPage/AuthorizationPage';
import { RegisterPage } from './pages/registerPage/RegisterPage';
import { ChatListPage } from './pages/chatListPage/ChatListPage';
import { ProfilePage } from './pages/profilePage/ProfilePage';
import { ChangePasswordPage } from './pages/profilePage/changeUserDataPages/ChangePasswordPage';
import { ChangeDataPage } from './pages/profilePage/changeUserDataPages/ChangeDataPage';
import ErrorPage404 from './pages/errorPages/error404/ErrorPage404';
import ErrorPage500 from './pages/errorPages/error500/ErrorPage500';

import { AuthService } from './services/AuthService';
import { UserService } from './services/UserService';
import { ChatsService } from './services/ChatsService';
import { AuthController } from './controllers/AuthController';
import { UserController } from './controllers/UserController';
import { ChatController } from './controllers/ChatController';

import { AppWithControllers } from './types/app';
import { store } from './store/Store';
import { MessagesService } from './services/MessagesService';

export default class App implements AppWithControllers {
  private appElement: HTMLElement | null;

  private readonly pageContainer: HTMLElement;

  public authController: AuthController;

  public userController: UserController;

  public chatController: ChatController;

  public router: Router;

  public messagesService: MessagesService;

  constructor() {
    this.appElement = document.getElementById('app');

    this.pageContainer = document.createElement('main');
    this.pageContainer.id = 'page';
    this.appElement?.appendChild(this.pageContainer);

    this.router = new Router('#page');

    this.initializeMVC();

    this.messagesService = new MessagesService();

    this.registerRoutes();
  }

  private initializeMVC(): void {
    const authService = new AuthService();
    const userService = new UserService();
    const chatService = new ChatsService();

    this.authController = new AuthController(authService, this.router);
    this.userController = new UserController(userService);
    this.chatController = new ChatController(chatService);
  }

  private registerRoutes(): void {
    this.router
      .use('/', AuthorizationPage, { app: this })
      .use('/sign-up', RegisterPage, { app: this })
      .use('/settings', ProfilePage, { app: this })
      .use('/messenger', ChatListPage, { app: this })
      .use('/settings/password', ChangePasswordPage, { app: this })
      .use('/settings/userData', ChangeDataPage, { app: this })
      .use('/404', ErrorPage404, { app: this })
      .use('/500', ErrorPage500, { app: this });
  }

  public async init(): Promise<void> {
    const isAuth = await this.authController.checkAuth();

    if (isAuth) {
      const user = await this.authController.fetchUser();
      store.set('user', user);

      try {
        const chats = await this.chatController.loadChats();
        store.set('chats', chats);
      } catch (e) {
        store.set('chats', []);
      }
    } else {
      store.set('user', null);
      store.set('chats', []);
      store.set('selectedChatId', null);
    }

    const publicRoutes = new Set<string>(['/', '/sign-up']);
    const pathname = window.location.pathname;

    if (!isAuth && !publicRoutes.has(pathname)) {
      window.history.replaceState({}, '', '/');
    }
  }


  public render(): void {
    this.router.start();
  }
}
