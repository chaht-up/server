import pool from './pool';
// eslint-disable-next-line no-unused-vars
import { IMessageRecord } from '../../types';

const getAllMessages = async (): Promise<IMessageRecord[]> => {
  const { rows } = await pool.query(
    'SELECT id, text, created_at as "createdAt" FROM messages',
  );

  return rows;
};

export default getAllMessages;
