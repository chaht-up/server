import bcrypt from 'bcrypt';
import pool from '../pool';

interface IUserInfo {
  username: string;
  userId: number;
}

const sql = `SELECT u.id as "userId", u.username, us.password as "hash"
FROM users u
JOIN user_secrets us ON us.user_id = u.id
WHERE u.username = $1`;

const authenticateUser = async (username: string, password: string): Promise<IUserInfo> => {
  const { rows: [{ hash, ...userInfo }] } = await pool.query(sql, [username]);

  if (await bcrypt.compare(password, hash)) {
    return userInfo as IUserInfo;
  }

  throw new Error('Invalid credentials');
};

export default authenticateUser;
