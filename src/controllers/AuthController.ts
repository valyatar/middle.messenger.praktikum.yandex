import Router from '../router/Router';
import { AuthService } from '../services/AuthService';
import { User, RegisterData } from '../types/app';

type StoredUser = User;

function safeParseUser(raw: string | null): StoredUser | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && 'id' in parsed) {
      return parsed as StoredUser;
    }
    return null;
  } catch {
    return null;
  }
}

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  async login(login: string, password: string): Promise<boolean> {
    try {
      await this.authService.login({ login, password });
      const user = await this.authService.getUser();
      this.storeUser(user);

      this.router.go('/messenger');
      return true;
    } catch (error: unknown) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async register(userData: RegisterData): Promise<boolean> {
    try {
      await this.authService.register(userData);
      const user = await this.authService.getUser();
      this.storeUser(user);

      this.router.go('/messenger');
      return true;
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error: unknown) {
      console.error('Logout failed:', error);
    } finally {
      this.clearUser();
      this.router.go('/');
    }
  }

  async checkAuth(): Promise<boolean> {
    try {
      const user = await this.authService.getUser();
      this.storeUser(user);
      return true;
    } catch {
      this.clearUser();
      return false;
    }
  }

  async fetchUser(): Promise<User> {
    try {
      const user = await this.authService.getUser();
      this.storeUser(user);
      return user;
    } catch (error: unknown) {
      console.error('Fetch failed:', error);
      return {} as User;
    }
  }

  getCurrentUser(): User | null {
    return safeParseUser(localStorage.getItem('user'));
  }

  private storeUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearUser(): void {
    localStorage.removeItem('user');
  }
}
