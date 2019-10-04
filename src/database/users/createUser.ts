import bcrypt from 'bcrypt';
import pool from '../pool';

const insertUser = 'INSERT INTO users (username) VALUES ($1) RETURNING id';
const insertSecret = 'INSERT INTO user_secrets (user_id, password) VALUES ($1, $2)';

const createUser = async (username: string, password: string): Promise<number> => {
  const client = await pool.connect();
  try {
    client.query('BEGIN');
    const { rows: [{ id }] } = await client.query(insertUser, [username]);
    const passwordHash = await bcrypt.hash(password, 10);
    await client.query(insertSecret, [id, passwordHash]);
    client.query('COMMIT');
    return id;
  } catch (e) {
    client.query('ROLLBACK');
    console.error(e);
    throw e;
  } finally {
    client.release();
  }
};

export default createUser;
