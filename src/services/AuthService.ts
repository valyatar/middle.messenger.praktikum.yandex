import { HTTPTransport } from './HTTPTransport';

export interface LoginData {
  login: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export interface User {
  id: number;
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

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

    if (response.status !== 200) {
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

    if (response.status !== 200) {
      throw new Error(`Registration failed with status ${response.status}`);
    }

    return JSON.parse(response.responseText);
  }

  async logout(): Promise<void> {
    const response = await this.http.post('/auth/logout');

    if (response.status !== 200) {
      throw new Error(`Logout failed with status ${response.status}`);
    }
  }

  async getUser(): Promise<User> {
    const response = await this.http.get('/auth/user');

    if (response.status !== 200) {
      throw new Error(`Get user failed with status ${response.status}`);
    }

    return JSON.parse(response.responseText);
  }
}
