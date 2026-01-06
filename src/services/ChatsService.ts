import { HTTPTransport } from './http/HTTPTransport';
import { Chat, ChatUserData } from '../types/app';

type CreateChatRequest = { title: string };
type DeleteChatRequest = { chatId: number };
type TokenResponse = { token: string };

export class ChatsService {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport();
  }

  async getChats(): Promise<Chat[]> {
    return this.http.get<Chat[]>('/chats');
  }

  async createChat(title: string): Promise<void> {
    await this.http.post<void>('/chats', {
      data: { title } as CreateChatRequest,
    });
  }

  async deleteChat(chatId: number): Promise<void> {
    await this.http.delete<void>('/chats', {
      data: { chatId } as DeleteChatRequest,
    });
  }

  async addUserToChat(data: ChatUserData): Promise<void> {
    await this.http.put<void>('/chats/users', {
      data,
    });
  }

  async removeUserFromChat(data: ChatUserData): Promise<void> {
    await this.http.delete<void>('/chats/users', {
      data,
    });
  }

  async getChatToken(chatId: number): Promise<TokenResponse> {
    return this.http.post<TokenResponse>(`/chats/token/${chatId}`);
  }
}
