import { ChatMessage } from '../store/types';

type Handlers = {
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onMessages?: (messages: ChatMessage[]) => void;
  onMessage?: (message: ChatMessage) => void;
  onError?: (event: Event) => void;
};

export class MessagesService {
  private socket: WebSocket | null = null;

  private pingIntervalId: number | null = null;

  private handlers: Handlers = {};

  public setHandlers(handlers: Handlers): void {
    this.handlers = handlers;
  }

  public connect(params: { userId: number; chatId: number; token: string }): void {
    const { userId, chatId, token } = params;

    this.disconnect();

    const url = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;
    const socket = new WebSocket(url);
    this.socket = socket;

    socket.addEventListener('open', () => {
      console.log('Соединение установлено');
      this.startPing();
      this.handlers.onOpen?.();
    });

    socket.addEventListener('close', (event: CloseEvent) => {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }
      console.log(`Код: ${event.code} | Причина: ${event.reason}`);

      this.stopPing();
      if (this.socket === socket) this.socket = null;

      this.handlers.onClose?.(event);
    });

    socket.addEventListener('message', (event: MessageEvent) => {
      console.log('Получены данные', event.data);

      let parsed: unknown;
      try {
        parsed = JSON.parse(String(event.data));
      } catch {
        return;
      }

      if (Array.isArray(parsed)) {
        this.handlers.onMessages?.(parsed as ChatMessage[]);
        return;
      }

      if (parsed && typeof parsed === 'object') {
        const msg = parsed as ChatMessage;

        if ((msg as { type?: unknown }).type === 'pong') return;

        this.handlers.onMessage?.(msg);
      }
    });

    socket.addEventListener('error', (event: Event) => {
      console.log('Ошибка', event);
      this.handlers.onError?.(event);
    });
  }

  public disconnect(): void {
    this.stopPing();

    if (this.socket) {
      try {
        this.socket.close();
      } catch {
        // ignore
      }
      this.socket = null;
    }
  }

  private startPing(): void {
    this.stopPing();
    this.pingIntervalId = window.setInterval(() => this.ping(), 15000);
  }

  private stopPing(): void {
    if (this.pingIntervalId !== null) {
      window.clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
    }
  }

  public ping(): void {
    if (!this.socket) return;
    this.socket.send(JSON.stringify({ type: 'ping' }));
  }

  public getOld(offset = 0): void {
    if (!this.socket) return;
    this.socket.send(JSON.stringify({ content: String(offset), type: 'get old' }));
  }

  public sendMessage(content: string): void {
    if (!this.socket) return;
    this.socket.send(JSON.stringify({ content, type: 'message' }));
  }
}
