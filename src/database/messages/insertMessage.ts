import pool from '../pool';
// eslint-disable-next-line no-unused-vars
import { IMessageRecord } from '../../types';

const query = `INSERT INTO messages(text)
VALUES ($1) RETURNING id, text, created_at as "createdAt"`;

const insertMessage = async (text: string): Promise<IMessageRecord> => {
  const { rows: [newMessage] } = await pool.query(query, [text]);
  return newMessage;
};

export default insertMessage;
