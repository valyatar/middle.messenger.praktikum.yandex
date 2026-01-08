import { AppState } from './types';

type Listener = () => void;
type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function setByPath(obj: UnknownRecord, path: string, value: unknown): void {
  const keys = path.split('.');
  let current: UnknownRecord = obj;

  keys.slice(0, -1).forEach((key) => {
    const next = current[key];
    if (!isRecord(next)) {
      current[key] = {};
    }
    current = current[key] as UnknownRecord;
  });

  current[keys[keys.length - 1]] = value;
}

export class Store {
  private state: AppState = {
    user: null,
    chats: [],
    selectedChatId: null,
    messagesByChatId: {},
  };

  private listeners: Set<Listener> = new Set();

  public getState(): AppState {
    return this.state;
  }

  public set<K extends keyof AppState>(key: K, value: AppState[K]): void;

  public set(path: string, value: unknown): void;

  public set(path: string, value: unknown): void {
    setByPath(this.state as unknown as UnknownRecord, path, value);
    this.listeners.forEach((cb) => cb());
  }

  public subscribe(cb: Listener): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}

export const store = new Store();
