import { HTTPTransport } from './HTTPTransport';
import { Chat, ChatUserData } from '../types/app';

export class ChatsService {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport();
  }

  async getChats(): Promise<Chat[]> {
    const response = await this.http.get('/chats');

    if (response.status !== 200) {
      throw new Error(`Get chats failed with status ${response.status}`);
    }

    return JSON.parse(response.responseText);
  }

  async createChat(title: string): Promise<void> {
    const response = await this.http.post('/chats', {
      data: JSON.stringify(title),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error(`Create chat failed with status ${response.status}`);
    }
  }

  async deleteChat(chatId: number): Promise<void> {
    const response = await this.http.delete('/chats', {
      data: JSON.stringify({ chatId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error(`Delete chat failed with status ${response.status}`);
    }
  }

  async addUserToChat(data: ChatUserData): Promise<void> {
    const response = await this.http.put('/chats/users', {
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error(`Add user failed with status ${response.status}`);
    }
  }

  async removeUserFromChat(data: ChatUserData): Promise<void> {
    const response = await this.http.delete('/chats/users', {
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error(`Remove user failed with status ${response.status}`);
    }
  }

  async getChatToken(chatId: number): Promise<{ token: string }> {
    const response = await this.http.post(`/chats/token/${chatId}`);

    if (response.status !== 200) {
      throw new Error(`Get chat token failed with status ${response.status}`);
    }

    return JSON.parse(response.responseText);
  }
}
