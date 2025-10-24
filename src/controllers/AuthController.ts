import { AuthService } from '../services/AuthService';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(login: string, password: string): Promise<boolean> {
    try {
      await this.authService.login({ login, password });
      const user = await this.authService.getUser();
      this.storeUser(user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async register(userData: {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
  }): Promise<boolean> {
    try {
      await this.authService.register(userData);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.clearUser();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  async checkAuth(): Promise<boolean> {
    try {
      const user = await this.authService.getUser();
      if (user) {
        this.storeUser(user);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  private storeUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearUser() {
    localStorage.removeItem('user');
  }
}
