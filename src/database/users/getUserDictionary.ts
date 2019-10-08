import pool from '../pool';

interface IUserEntry {
  username: string;
}

interface IUserDictionary {
  [id: number]: IUserEntry;
}

const sql = 'SELECT id, username FROM users';

const getUserDictionary = async (): Promise<IUserDictionary> => {
  const { rows: users } = await pool.query(sql);

  const userDict: IUserDictionary = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const { id, ...rest } of users) {
    userDict[id] = rest;
  }

  return userDict;
};

export default getUserDictionary;
