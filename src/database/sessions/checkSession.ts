import pool from '../pool';

const checkSession = async (token: string): Promise<number> => {
  const sql = `SELECT u.id
  FROM users u
  JOIN session s ON s.user_id = u.id
  WHERE token = $1`;
  const { rows: [userInfo] } = await pool.query(sql, [token]);
  return userInfo ? userInfo.id : 0;
};

export default checkSession;
