import pool from '../pool';

const sql = 'SELECT id, username FROM users';

const getUserDictionary = async (): Promise<Api.UserDictionary> => {
  const { rows: users } = await pool.query(sql);

  const userDict: Api.UserDictionary = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const { id, ...rest } of users) {
    userDict[id] = rest;
  }

  return userDict;
};

export default getUserDictionary;
