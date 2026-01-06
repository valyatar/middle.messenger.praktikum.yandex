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

function mapChatsToItems(chats: Chat[]): ChatItem[] {
  return chats.map((chat) => {
    const lastMessageText =
      chat.last_message && typeof chat.last_message === 'object' && 'content' in chat.last_message
        ? String((chat.last_message as { content?: unknown }).content ?? '')
        : '';

    return new ChatItem({
      id: String(chat.id),
      title: chat.title,
      lastMessage: lastMessageText || '',
    });
  });
}

export class ChatListPage extends Block<ChatListPageProps> {
  private unsubscribeStore: (() => void) | null;

  constructor(props: ChatListPageProps) {
    const chats = store.getState().chats;
    const chatItems = mapChatsToItems(chats);

    const componentProps = {
      SearchInput: new Input({
        id: 'search',
        name: 'search',
        type: 'text',
        placeholder: 'Поиск',
      }),

      ChatItems: chatItems,

      // временно оставляем одно тестовое сообщение
      Message: new Message({
        id: '1',
        text: 'тестовое сообщение',
        time: '23:59',
        isOwn: true,
      }),

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
        // ВАЖНО: обработчик клика на самой кнопке
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

      events: {
        submit: (e: Event) => this.handleSubmit(e),
      },
    };

    super({
      ...componentProps,
      ...props,
    });

    this.unsubscribeStore = store.subscribe(() => {
      const nextChats = store.getState().chats;
      const nextItems = mapChatsToItems(nextChats);
      this.setLists({ ChatItems: nextItems });
    });
  }

  public destroy(): void {
    this.unsubscribeStore?.();
    this.unsubscribeStore = null;
    super.destroy();
  }

  private handleAddChat(): void {
    const titleRaw = window.prompt('Название чата');
    const title = (titleRaw ?? '').trim();

    if (!title) {
      return;
    }

    // eslint-safe: не делаем async обработчик, промис явно "прикреплён"
    void this.props.app.chatController
      .createChat(title)
      .then(() => this.props.app.chatController.loadChats())
      .then((chats: Chat[]) => {
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
      console.log('Ошибка валидации');
      return;
    }

    console.log('Данные со страницы сообщений:', validationResult.data);
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
          <div class="right__messages">
            {{{ Message }}}
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
