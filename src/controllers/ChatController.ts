import { ChatsService } from '../services/ChatsService';
import { Chat } from '../types/app';

export class ChatController {
  private chats: Chat[] = [];

  constructor(private chatService: ChatsService) {}

  async loadChats(): Promise<Chat[]> {
    this.chats = await this.chatService.getChats();
    return this.chats;
  }

  async createChat(title: string): Promise<Chat[]> {
    await this.chatService.createChat(title);
    return this.loadChats();
  }

  async deleteChat(chatId: number): Promise<Chat[]> {
    await this.chatService.deleteChat(chatId);
    return this.loadChats();
  }

  async addUsersToChat(chatId: number, users: number[]): Promise<void> {
    await this.chatService.addUserToChat({ chatId, users });
  }

  async removeUsersFromChat(chatId: number, users: number[]): Promise<void> {
    await this.chatService.removeUserFromChat({ chatId, users });
  }

  async getChatToken(chatId: number): Promise<{ token: string }> {
    return this.chatService.getChatToken(chatId);
  }

  getCurrentChats(): Chat[] {
    return this.chats;
  }

  getChatById(chatId: number): Chat | undefined {
    return this.chats.find((chat) => chat.id === chatId);
  }
}
