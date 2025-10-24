import { HTTPTransport } from './HTTPTransport';
import { ChangePasswordData, User, UserProfileData } from '../types/app';

export class UserService {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport();
  }

  async changeProfile(data: UserProfileData): Promise<User> {
    const response = await this.http.put('/user/profile', {
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse(response);
  }

  async changeAvatar(avatar: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', avatar);

    const response = await this.http.put('/user/profile/avatar', {
      data: formData,
    });

    return this.handleResponse(response);
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    const response = await this.http.put('/user/password', {
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.handleResponse(response);
  }

  async searchUser(login: string): Promise<User[]> {
    const response = await this.http.post('/user/search', {
      data: JSON.stringify({ login }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse(response);
  }

  async getUserById(id: number): Promise<User> {
    const response = await this.http.get(`/user/${id}`);
    return this.handleResponse(response);
  }

  private handleResponse(response: XMLHttpRequest): any {
    if (response.status >= 200 && response.status < 300) {
      if (response.responseText) {
        return JSON.parse(response.responseText);
      }
      return;
    }

    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = JSON.parse(response.responseText);
      errorMessage = errorData.reason || errorMessage;
    } catch {

    }

    throw new Error(errorMessage);
  }
}
