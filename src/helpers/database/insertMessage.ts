import pool from './pool';
// eslint-disable-next-line no-unused-vars
import { IMessageRecord } from '../../types';

const query = `INSERT INTO messages(text)
VALUES ($1) RETURNING id, text, created_at as "createdAt"`;

const nullRecord = {
  id: 0,
  text: '',
  createdAt: new Date(0),
};

const insertMessage = async (text: string): Promise<IMessageRecord> => {
  let newMessage: IMessageRecord = nullRecord;

  try {
    const result = await pool.query(query, [text]);
    [newMessage] = result.rows;
  } catch (e) {
    console.error('Encounterd an error inserting new message:');
    console.error(e);
  }

  return newMessage;
};

export default insertMessage;
