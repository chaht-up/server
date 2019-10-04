import bcrypt from 'bcrypt';
import pool from '../pool';

const sql = `SELECT u.id, us.password
FROM users u
JOIN user_secrets us ON us.user_id = u.id
WHERE u.username = $1`;

const authenticateUser = async (username: string, password: string): Promise<number> => {
  const { rows: [{ id, password: passwordHash }] } = await pool.query(sql, [username]);

  if (await bcrypt.compare(password, passwordHash)) {
    return id;
  }

  throw new Error('Invalid credentials');
};

export default authenticateUser;
