import { store } from '../store/Store';
import type { AppWithControllers } from '../types/app';
import type { Chat } from '../types/app';

export async function initAfterAuth(app: AppWithControllers): Promise<void> {
  const user = await app.authController.fetchUser();
  store.set('user', user);

  store.set('chats', []);
  store.set('selectedChatId', null);
  store.set('messagesByChatId', {});

  const chats: Chat[] = await app.chatController.loadChats();
  store.set('chats', chats);
}
