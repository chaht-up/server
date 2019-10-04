import pool from '../pool';

const sql = 'INSERT INTO sessions (user_id) VALUES ($1) RETURNING token';

const createSession = async (userId: number): Promise<string> => {
  const { rows: [{ token }] } = await pool.query(sql, [userId]);
  return token;
};

export default createSession;
