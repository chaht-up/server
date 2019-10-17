// eslint-disable-next-line no-unused-vars
declare namespace Api {
  export interface UserInfo {
    username: string;
    userId: number;
  }

  export interface MessageRecord {
    id: number;
    text: string;
    createdAt: Date;
  }

  export interface UserEntry {
    username: string;
  }

  export interface UserDictionary {
    [id: number]: UserEntry;
  }

  interface EventListener {
    (...args: any[]): void;
  }
  interface CurriedEventListener {
    (io: import('socket.io').Server, socket: import('socket.io').Socket): EventListener
  }

  export type EventTuple = [string, CurriedEventListener];
}
