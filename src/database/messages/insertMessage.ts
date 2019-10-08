import pool from '../pool';
// eslint-disable-next-line no-unused-vars
import { IMessageRecord } from '../../types';

const sql = `INSERT INTO messages(text, sender_id)
VALUES ($1, $2)
RETURNING id, text, sender_id as "senderId", created_at as "createdAt"`;

const insertMessage = async (text: string, userId: number): Promise<IMessageRecord> => {
  const { rows: [newMessage] } = await pool.query(sql, [text, userId]);
  return newMessage;
};

export default insertMessage;
