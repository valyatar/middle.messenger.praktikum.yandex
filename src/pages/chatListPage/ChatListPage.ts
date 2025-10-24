import Block from '../../framework/Block';
import Input from '../../components/Input/Input';
import './chatList.pcss';
import Button from '../../components/Button/Button';
import { validateForm } from '../../helpers/validation';
import { arrowRightIcon } from '../../../public/static/icons/arrowRight';
import { ChatListPageProps } from '../../types/app';
import { ChatItem } from '../../components/ChatItem/ChatItem';
import { Message } from '../../components/MessageItem/Message';

export class ChatListPage extends Block<ChatListPageProps> {
  constructor(props: ChatListPageProps) {
    const componentProps = {
      SearchInput: new Input({
        id: 'search',
        name: 'search',
        type: 'text',
        placeholder: 'Поиск',
      }),
      ChatItem: new ChatItem({
        id: '1',
        title: 'Тестовый чатик',
        lastMessage: 'последнее сообщение',
      }),
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
      events: {
        submit: (e: Event) => this.handleSubmit(e),
      },
    };

    super({
      ...componentProps,
      ...props,
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
    return `<main class="chat-list">
    <div class="chat-layout">
        <aside class="left">
            <div class="left__search">
                {{{ SearchInput }}}
            </div>
            <div class="left__list">
                {{{ ChatItem }}}
            </div>
        </aside>

        <main class="right">
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
        </main>
    </div>
</main>`;
  }
}
