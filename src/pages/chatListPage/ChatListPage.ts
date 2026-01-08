import Block from '../../framework/Block';
import Input from '../../components/Input/Input';
import './chatList.pcss';
import Button from '../../components/Button/Button';
import { validateForm } from '../../helpers/validation';
import { arrowRightIcon } from '../../../public/static/icons/arrowRight';
import { ChatListPageProps, Chat } from '../../types/app';
import { ChatItem } from '../../components/ChatItem/ChatItem';
import { Message } from '../../components/MessageItem/Message';
import Link from '../../components/Link/Link';

import { store } from '../../store/Store';
import { plusIcon } from '../../../public/static/icons/plusIcon';
import { ChatMessage } from '../../store/types';

function mapChatsToItems(chats: Chat[], selectedChatId: number | null): ChatItem[] {
  return chats.map((chat) => {
    const lastMessageText =
      chat.last_message && typeof chat.last_message === 'object' && 'content' in chat.last_message
        ? String((chat.last_message as { content?: unknown }).content ?? '')
        : '';

    return new ChatItem({
      id: String(chat.id),
      title: chat.title,
      lastMessage: lastMessageText || '',
      isActive: selectedChatId === chat.id,
      onSelect: (id: number) => {
        store.set('selectedChatId', id);
      },
    });
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function mapMessagesToItems(messages: ChatMessage[], myUserId: number | null): Message[] {
  const ordered = messages.slice().reverse();

  return ordered.map((m) => new Message({
    id: String(m.id ?? `${m.time}-${m.user_id}`),
    text: m.content,
    time: formatTime(m.time),
    isOwn: myUserId !== null && m.user_id === myUserId,
  }));
}

export class ChatListPage extends Block<ChatListPageProps> {
  private unsubscribeStore: (() => void) | null;

  private activeChatId: number | null;

  constructor(props: ChatListPageProps) {
    const state = store.getState();

    const chatItems = mapChatsToItems(state.chats, state.selectedChatId);

    const myUserId = state.user?.id ?? null;
    const chatId = state.selectedChatId;
    const msgs = chatId ? (state.messagesByChatId?.[chatId] ?? []) : [];

    const componentProps = {
      SearchInput: new Input({
        id: 'search',
        name: 'search',
        type: 'text',
        placeholder: 'Поиск',
      }),

      ChatItems: chatItems,

      MessageItems: mapMessagesToItems(msgs, myUserId),

      MessageInput: new Input({
        id: 'message',
        name: 'message',
        type: 'text',
        placeholder: 'Сообщение',
      }),

      SendBtn: new Button({
        id: 'sendBtn',
        icon: arrowRightIcon,
        type: 'submit',
      }),

      AddChatBtn: new Button({
        id: 'addChatBtn',
        icon: plusIcon,
        type: 'button',
        size: 's',
        events: {
          click: (e: Event) => {
            e.preventDefault();
            this.handleAddChat();
          },
        },
      }),

      ProfileLink: new Link({
        href: '/settings',
        text: 'Профиль >',
        onClick: (event: Event) => {
          event.preventDefault();
          props.app.router.go('/settings');
        },
      }),
      AddUserBtn: new Button({
        id: 'addUserBtn',
        text: 'Добавить пользователя в чат',
        type: 'button',
        events: {
          click: (e: Event) => {
            e.preventDefault();
            this.handleAddUser();
          },
        },
      }),

      RemoveUserBtn: new Button({
        id: 'removeUserBtn',
        text: 'Удалить пользователя из чата',
        type: 'button',
        events: {
          click: (e: Event) => {
            e.preventDefault();
            this.handleRemoveUser();
          },
        },
      }),

      events: {
        submit: (e: Event) => this.handleSubmit(e),
      },
    };

    super({
      ...componentProps,
      ...props,
    });

    this.activeChatId = state.selectedChatId ?? null;

    if (this.activeChatId !== null) {
      this.connectToActiveChat();
    }

    this.unsubscribeStore = store.subscribe(() => {
      const s = store.getState();

      this.setLists({ ChatItems: mapChatsToItems(s.chats, s.selectedChatId) });

      if (s.selectedChatId !== this.activeChatId) {
        this.activeChatId = s.selectedChatId ?? null;
        this.connectToActiveChat();
      }

      const myId = s.user?.id ?? null;
      const chatIdNow = s.selectedChatId;
      const messages = chatIdNow ? (s.messagesByChatId?.[chatIdNow] ?? []) : [];
      this.setLists({ MessageItems: mapMessagesToItems(messages, myId) });
    });
  }

  public destroy(): void {
    this.unsubscribeStore?.();
    this.unsubscribeStore = null;

    this.props.app.messagesService.disconnect();

    super.destroy();
  }

  private connectToActiveChat(): void {
    const s = store.getState();
    const chatId = s.selectedChatId;
    const userId = s.user?.id;

    if (!chatId || !userId) {
      this.props.app.messagesService.disconnect();
      return;
    }

    void this.props.app.chatController
      .getChatToken(chatId)
      ?.then(({ token }) => {
        this.props.app.messagesService.setHandlers({
          onOpen: () => {
            this.props.app.messagesService.getOld(0);
          },
          onMessages: (messages) => {
            store.set(`messagesByChatId.${chatId}`, messages);
          },
          onMessage: (message) => {
            const current = store.getState().messagesByChatId?.[chatId] ?? [];
            store.set(`messagesByChatId.${chatId}`, [message, ...current]);

            const chats = store.getState().chats ?? [];

            const updatedChats = chats.map((c) => {
              if (c.id !== chatId) return c;

              return {
                ...c,
                last_message: {
                  content: message.content,
                  time: message.time,
                },
              };
            });

            store.set('chats', updatedChats);
          },
        });

        this.props.app.messagesService.connect({ userId, chatId, token });
      })
      .catch((e: unknown) => {
        console.error(e);
      });
  }

  private handleAddChat(): void {
    const titleRaw = window.prompt('Название чата');
    const title = (titleRaw ?? '').trim();
    if (!title) return;

    void this.props.app.chatController
      .createChat(title)
      .then((chats) => {
        store.set('chats', chats);
      })
      .catch((error: unknown) => {
        const msg = error instanceof Error ? error.message : 'Не удалось создать чат';
        alert(msg);
      });
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const validationResult = validateForm(form);

    if (!validationResult.isValid) {
      alert('Проверьте сообщение');
      return;
    }

    const data = validationResult.data as Record<string, unknown>;
    const text = typeof data.message === 'string' ? data.message.trim() : '';

    if (!text) {
      return;
    }

    const chatId = store.getState().selectedChatId;
    if (!chatId) {
      alert('Выберите чат');
      return;
    }

    this.props.app.messagesService.sendMessage(text);

    const input = document.getElementById('message') as HTMLInputElement | null;
    if (input) input.value = '';
  }

  private handleAddUser(): void {
    const chatId = store.getState().selectedChatId;
    if (!chatId) {
      alert('Сначала выбери чат');
      return;
    }

    const loginRaw = window.prompt('Логин пользователя для добавления');
    const login = (loginRaw ?? '').trim();
    if (!login) return;

    void this.props.app.userController
      .searchUsers(login)
      .then((users) => {
        const user = users[0];
        if (!user) throw new Error('Пользователь не найден');

        return this.props.app.chatController.addUsersToChat(chatId, [user.id]);
      })
      .then(() => {
        alert('Пользователь добавлен в чат');
      })
      .catch((error: unknown) => {
        const msg = error instanceof Error ? error.message : 'Не удалось добавить пользователя';
        alert(msg);
      });
  }

  private handleRemoveUser(): void {
    const chatId = store.getState().selectedChatId;
    if (!chatId) {
      alert('Сначала выбери чат');
      return;
    }

    const loginRaw = window.prompt('Логин пользователя для удаления');
    const login = (loginRaw ?? '').trim();
    if (!login) return;

    void this.props.app.userController
      .searchUsers(login)
      .then((users) => {
        const user = users[0];
        if (!user) throw new Error('Пользователь не найден');

        return this.props.app.chatController.removeUsersFromChat(chatId, [user.id]);
      })
      .then(() => {
        alert('Пользователь удалён из чата');
      })
      .catch((error: unknown) => {
        const msg = error instanceof Error ? error.message : 'Не удалось удалить пользователя';
        alert(msg);
      });
  }

  render(): string {
    return `<div class="chat-list">
      <div class="chat-layout">
        <aside class="left">
          <div class="left__profile-link">
            {{{ ProfileLink }}}
          </div>
          <div class="left__search">
            {{{ SearchInput }}}
            {{{ AddChatBtn }}}
          </div>
          <div class="left__list">
            {{{ ChatItems }}}
          </div>
        </aside>

        <div class="right">
           <div>
            {{{ AddUserBtn }}}
            {{{ RemoveUserBtn }}}
           </div>
          <div class="right__messages">
            {{{ MessageItems }}}
          </div>
          <div class="right__composer">
            <form>
              <div class="message_container">
                {{{ MessageInput }}}
                {{{ SendBtn }}}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>`;
  }
}
