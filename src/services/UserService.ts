import { HTTPTransport } from './http/HTTPTransport';
import { ChangePasswordData, User, UserProfileData } from '../types/app';

type SearchUserRequest = { login: string };

export class UserService {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport();
  }

  async changeProfile(data: UserProfileData): Promise<User> {
    return this.http.put<User>('/user/profile', {
      data,
    });
  }

  async changeAvatar(avatar: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', avatar);

    return this.http.put<User>('/user/profile/avatar', {
      data: formData,
    });
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    await this.http.put<void>('/user/password', {
      data,
    });
  }

  async searchUser(login: string): Promise<User[]> {
    return this.http.post<User[]>('/user/search', {
      data: { login } as SearchUserRequest,
    });
  }

  async getUserById(id: number): Promise<User> {
    return this.http.get<User>(`/user/${id}`);
  }
}
