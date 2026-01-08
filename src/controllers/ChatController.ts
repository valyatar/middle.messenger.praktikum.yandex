import { ChatsService } from '../services/ChatsService';
import { Chat } from '../types/app';

export class ChatController {
  private chats: Chat[] = [];

  constructor(private chatService: ChatsService) {}

  async loadChats(): Promise<Chat[]> {
    try {
      this.chats = await this.chatService.getChats();
      return this.chats;
    } catch (error) {
      console.error('Failed to load chats:', error);
      return [];
    }
  }

  async createChat(title: string): Promise<Chat[]> {
    try {
      await this.chatService.createChat(title);
      return await this.loadChats();
    } catch (error) {
      console.error('Failed to create chat:', error);
      return this.chats;
    }
  }

  async deleteChat(chatId: number): Promise<Chat[]> {
    try {
      await this.chatService.deleteChat(chatId);
      return await this.loadChats();
    } catch (error) {
      console.error('Failed to delete chat:', error);
      return this.chats;
    }
  }

  async addUsersToChat(chatId: number, users: number[]): Promise<void> {
    try {
      await this.chatService.addUserToChat({ chatId, users });
    } catch (error) {
      console.error('Failed to add users to chat:', error);
    }
  }

  async removeUsersFromChat(chatId: number, users: number[]): Promise<void> {
    try {
      await this.chatService.removeUserFromChat({ chatId, users });
    } catch (error) {
      console.error('Failed to remove users from chat:', error);
    }
  }

  async getChatToken(chatId: number): Promise<{ token: string }> {
    try {
      return await this.chatService.getChatToken(chatId);
    } catch (error) {
      console.error('Failed to get chat token:', error);
      throw error; // важно пробросить — без токена сокет не откроется
    }
  }

  getCurrentChats(): Chat[] {
    return this.chats;
  }

  getChatById(chatId: number): Chat | undefined {
    return this.chats.find((chat) => chat.id === chatId);
  }
}
