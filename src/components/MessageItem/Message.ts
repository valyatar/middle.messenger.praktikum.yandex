import Block, { BlockProps } from '../../framework/Block';
import './message.pcss';

interface MessageProps extends BlockProps {
  text: string;
  time: string;
  isOwn: boolean;
  isRead?: boolean;
}

export class Message extends Block<MessageProps> {
  constructor(props: MessageProps) {
    super({
      ...props,
    });
  }

  render(): string {
    return `
    <div class="message {{#if isOwn}}message--own{{/if}}">
      <div class="message__bubble">
        <div class="message__text">{{text}}</div>
        <div class="message__meta">
          <span class="message__time">{{time}}</span>
          {{#if isOwn}}
            <div class="message__status">
              {{#if isRead}}
                <span class="message__read">✓✓</span>
              {{else}}
                <span class="message__sent">✓</span>
              {{/if}}
            </div>
          {{/if}}
        </div>
      </div>
    </div>
  `;
  }
}
