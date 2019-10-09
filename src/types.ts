// eslint-disable-next-line no-unused-vars
namespace Api {
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
}
