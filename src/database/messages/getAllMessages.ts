import pool from '../pool';
// eslint-disable-next-line no-unused-vars
import { IMessageRecord } from '../../types';

const sql = 'SELECT id, text, created_at as "createdAt" FROM messages';

const getAllMessages = async (): Promise<IMessageRecord[]> => {
  const { rows } = await pool.query(sql);
  return rows;
};

export default getAllMessages;
