import { User, Chat } from '../types/app';

export interface ChatMessage {
  id?: number;
  user_id: number;
  chat_id: number;
  time: string;
  content: string;
  type: string;
}

export interface AppState {
  user: User | null;
  chats: Chat[];
  selectedChatId: number | null;
  messagesByChatId: Record<number, ChatMessage[]>;
}
