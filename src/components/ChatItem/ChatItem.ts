import Block, { BlockProps } from '../../framework/Block';
import './chatItem.pcss';

interface ChatItemProps extends BlockProps {
  id: string;
  title: string;
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
  avatar?: string;
  onClick?: (chatId: number) => void;
}

export class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super({
      ...props,
    });
  }

  render(): string {
    return `
      <div class="chat-item" data-chat-id="{{id}}">
        <div class="chat-item__avatar">
            <div class="chat-item__avatar-placeholder"></div>
        </div>
        <div class="chat-item__content">
          <div class="chat-item__header">
            <h3 class="chat-item__title">{{title}}</h3>
            <span class="chat-item__time">{{time}}</span>
          </div>
          <div class="chat-item__footer">
            <p class="chat-item__last-message">{{lastMessage}}</p>
            {{#if unreadCount}}
              <span class="chat-item__unread">{{unreadCount}}</span>
            {{/if}}
          </div>
        </div>
      </div>
    `;
  }
}
