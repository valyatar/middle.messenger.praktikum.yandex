import { HTTPTransport } from './http/HTTPTransport';
import { ChangePasswordData, User, UserProfileData } from '../types/app';
import { isSuccessStatus } from './http/HttpStatus';

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

    return this.parseResponse<User>(response);
  }

  async changeAvatar(avatar: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', avatar);

    const response = await this.http.put('/user/profile/avatar', {
      data: formData,
    });

    return this.parseResponse<User>(response);
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    const response = await this.http.put('/user/password', {
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.checkResponse(response);
  }

  async searchUser(login: string): Promise<User[]> {
    const response = await this.http.post('/user/search', {
      data: JSON.stringify({ login }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.parseResponse<User[]>(response);
  }

  async getUserById(id: number): Promise<User> {
    const response = await this.http.get(`/user/${id}`);
    return this.parseResponse<User>(response);
  }

  private parseResponse<T>(response: XMLHttpRequest): T {
    this.checkResponse(response);

    if (!response.responseText) {
      throw new Error('Empty response body');
    }

    try {
      return JSON.parse(response.responseText) as T;
    } catch (error) {
      throw new Error('Failed to parse response JSON');
    }
  }

  private checkResponse(response: XMLHttpRequest): void {
    if (!isSuccessStatus(response.status)) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = JSON.parse(response.responseText);
        errorMessage = errorData.reason || errorMessage;
      } catch {
      }

      throw new Error(errorMessage);
    }
  }
}
