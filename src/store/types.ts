import { Chat, User } from '../types/app';

export interface AppState {
  user: User | null;
  chats: Chat[];
}
