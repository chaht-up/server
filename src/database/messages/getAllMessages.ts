import pool from '../pool';

const sql = `SELECT id, text, sender_id as "senderId", created_at as "sentAt"
FROM messages`;

const getAllMessages = async (): Promise<Api.MessageRecord[]> => {
  const { rows } = await pool.query(sql);
  return rows;
};

export default getAllMessages;
