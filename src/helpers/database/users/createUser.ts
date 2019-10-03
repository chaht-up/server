import bcrypt from 'bcrypt';
import pool from '../pool';

const sqlQueryUser = 'INSERT INTO users (username) VALUES ($1) RETURNING id';
const sqlQueryUserSecret = 'INSERT INTO user_secrets (user_id, password) VALUES ($1, $2)';

const createUser = async (username: string, password: string) => {
  const { rows: [{ id }] } = await pool.query(sqlQueryUser, [username]);
  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query(sqlQueryUserSecret, [id, passwordHash]);
};

export default createUser;
