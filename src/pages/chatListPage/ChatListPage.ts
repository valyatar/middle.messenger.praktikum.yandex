import Block from '../../framework/Block';
import Input from '../../components/Input/Input';
import './chatList.pcss';
import Button from '../../components/Button/Button';
import { validateForm } from '../../helpers/validation';
import { arrowRightIcon } from '../../../public/static/icons/arrowRight';

export class ChatListPage extends Block {
  constructor() {
    super({
      SearchInput: new Input({
        id: 'search',
        name: 'search',
        type: 'text',
        placeholder: 'Поиск',
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
            <div class="left__list"><!-- список чатов --></div>
        </aside>

        <main class="right">
            <div class="right__messages"><!-- сообщения --></div>
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
