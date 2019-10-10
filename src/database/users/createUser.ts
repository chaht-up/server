import bcrypt from 'bcrypt';
import pool from '../pool';
import ApiError from '../../helpers/ApiError';
import { errors } from '../../helpers/messages';

const sqlUser = 'INSERT INTO users (username) VALUES ($1) RETURNING id';
const sqlSecret = 'INSERT INTO user_secrets (user_id, password) VALUES ($1, $2)';

const createUser = async (username: string, password: string): Promise<Api.UserInfo> => {
  const client = await pool.connect();
  try {
    client.query('BEGIN');
    const [{ rows: [{ id }] }, passwordHash] = await Promise.all([
      client.query(sqlUser, [username]),
      bcrypt.hash(password, 10),
    ]);
    await client.query(sqlSecret, [id, passwordHash]);
    client.query('COMMIT');
    return { userId: id, username };
  } catch (e) {
    client.query('ROLLBACK');

    if (e.constraint === 'users_username_key') {
      throw new ApiError(errors.USERNAME_NOT_AVAILABLE, 400);
    }

    console.error(e);
    throw e;
  } finally {
    client.release();
  }
};

export default createUser;
