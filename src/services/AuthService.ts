import { LoginData, RegisterData, User } from '../types/app';
import { HTTPError, HTTPTransport } from './http/HTTPTransport';

type SignUpResponse = { id: number };

export class AuthService {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport();
  }

  async login(data: LoginData): Promise<void> {
    try {
      await this.http.post<void>('/auth/signin', {
        data,
      });
    } catch (e: unknown) {
      if (e instanceof HTTPError) {
        const msg = e.reason ? `Login failed: ${e.reason}` : `Login failed (status ${e.status})`;
        throw new Error(msg);
      }
      throw e;
    }
  }

  async register(data: RegisterData): Promise<SignUpResponse> {
    try {
      return await this.http.post<SignUpResponse>('/auth/signup', {
        data,
      });
    } catch (e: unknown) {
      if (e instanceof HTTPError) {
        const msg = e.reason ? `Registration failed: ${e.reason}` : `Registration failed (status ${e.status})`;
        throw new Error(msg);
      }
      throw e;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.http.post<void>('/auth/logout');
    } catch (e: unknown) {
      if (e instanceof HTTPError) {
        const msg = e.reason ? `Logout failed: ${e.reason}` : `Logout failed (status ${e.status})`;
        throw new Error(msg);
      }
      throw e;
    }
  }

  async getUser(): Promise<User> {
    try {
      return await this.http.get<User>('/auth/user');
    } catch (e: unknown) {
      if (e instanceof HTTPError) {
        const msg = e.reason ? `Get user failed: ${e.reason}` : `Get user failed (status ${e.status})`;
        throw new Error(msg);
      }
      throw e;
    }
  }
}
