import pool from '../pool';
// eslint-disable-next-line no-unused-vars
import { IMessageRecord } from '../../types';

const sql = `SELECT id, text, sender_id as "senderId", created_at as "sentAt"
FROM messages`;

const getAllMessages = async (): Promise<IMessageRecord[]> => {
  const { rows } = await pool.query(sql);
  return rows;
};

export default getAllMessages;
