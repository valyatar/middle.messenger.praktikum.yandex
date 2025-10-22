import Block from '../../framework/Block';
import Input from "../../components/Input/Input";

import './chatList.pcss';

export class ChatListPage extends Block {
    constructor() {
        super({
            SearchInput: new Input({
                id: "search",
                name: "search",
                type: "text",
                placeholder: "Поиск",
            }),
            MessageInput: new Input({
                id: "message",
                name: "message",
                type: "text",
                placeholder: "Сообщение",
            }),
        });
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
                {{{ MessageInput }}}
            </div>
        </main>
    </div>
</main>`
    }
}