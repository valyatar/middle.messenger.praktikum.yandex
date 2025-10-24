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
      console.error('Load chats failed:', error);
      return [];
    }
  }

  async createChat(title: string): Promise<boolean> {
    try {
      await this.chatService.createChat(title);
      await this.loadChats();
      return true;
    } catch (error) {
      console.error('Create chat failed:', error);
      return false;
    }
  }

  async deleteChat(chatId: number): Promise<boolean> {
    try {
      await this.chatService.deleteChat(chatId);
      await this.loadChats();
      return true;
    } catch (error) {
      console.error('Delete chat failed:', error);
      return false;
    }
  }

  async addUsersToChat(chatId: number, users: number[]): Promise<boolean> {
    try {
      await this.chatService.addUserToChat({ chatId, users });
      return true;
    } catch (error) {
      console.error('Add users to chat failed:', error);
      return false;
    }
  }

  getCurrentChats(): Chat[] {
    return this.chats;
  }

  getChatById(chatId: number): Chat | undefined {
    return this.chats.find(chat => chat.id === chatId);
  }
}
