import pool from '../pool';

const sql = `SELECT u.id, s.is_active as "isActive"
FROM users u
JOIN sessions s ON s.user_id = u.id
WHERE token = $1`;

const retrieveSessionInfo = async (token: string): Promise<number> => {
  const { rows: [userInfo] } = await pool.query(sql, [token]);
  if (!userInfo) {
    throw new Error('Session not found');
  }

  if (!userInfo.isActive) {
    throw new Error('Session is invalid');
  }

  return userInfo.id;
};

export default retrieveSessionInfo;
