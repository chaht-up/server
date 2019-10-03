import bcrypt from 'bcrypt';
import pool from '../pool';

const sqlQueryUser = `SELECT us.password
FROM users u
JOIN user_secrets us ON us.user_id = u.id
WHERE u.username = $1`;

const authenticateUser = async (username: string, password: string) => {
  const { rows: [{ password: passwordHash }] } = await pool.query(sqlQueryUser, [username]);

  return bcrypt.compare(password, passwordHash);
};

export default authenticateUser;
