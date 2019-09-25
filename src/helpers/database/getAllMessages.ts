import pool from './pool';
// eslint-disable-next-line no-unused-vars
import { IMessageRecord } from '../../types';

const sqlQuery = 'SELECT id, text, created_at as "createdAt" FROM messages';

const getAllMessages = async (): Promise<IMessageRecord[]> => {
  let rows: IMessageRecord[] = [];

  try {
    ({ rows } = await pool.query(sqlQuery));
  } catch (e) {
    console.error('Encountered an error retrieving all mesages');
    console.error(e);
  }

  return rows;
};

export default getAllMessages;
