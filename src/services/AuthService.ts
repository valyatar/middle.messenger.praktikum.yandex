import { HTTPTransport } from './http/HTTPTransport';
import { LoginData, RegisterData, User } from '../types/app';
import { isSuccessStatus } from './http/HttpStatus';

export class AuthService {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport();
  }

  async login(data: LoginData): Promise<void> {
    const response = await this.http.post('/auth/signin', {
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!isSuccessStatus(response.status)) {
      throw new Error(`Login failed with status ${response.status}`);
    }
  }

  async register(data: RegisterData): Promise<{ id: number }> {
    const response = await this.http.post('/auth/signup', {
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!isSuccessStatus(response.status)) {
      throw new Error(`Registration failed with status ${response.status}`);
    }

    return JSON.parse(response.responseText);
  }

  async logout(): Promise<void> {
    const response = await this.http.post('/auth/logout');

    if (!isSuccessStatus(response.status)) {
      throw new Error(`Logout failed with status ${response.status}`);
    }
  }

  async getUser(): Promise<User> {
    const response = await this.http.get('/auth/user');

    if (!isSuccessStatus(response.status)) {
      throw new Error(`Get user failed with status ${response.status}`);
    }

    return JSON.parse(response.responseText);
  }
}
