import pool from '../pool';

const sql = `SELECT u.id as "userId", u.username, s.is_active as "isActive"
FROM users u
JOIN sessions s ON s.user_id = u.id
WHERE token = $1`;

const getSessionInfo = async (token: string): Promise<Api.UserInfo> => {
  const { rows: [userInfo] } = await pool.query(sql, [token]);
  if (!userInfo) {
    throw new Error('Session not found');
  }

  const { isActive, ...rest } = userInfo;

  if (!isActive) {
    throw new Error('Session is invalid');
  }

  return rest as Api.UserInfo;
};

export default getSessionInfo;
