import pool from '../pool';
import ApiError from '../../helpers/ApiError';
import { errors } from '../../helpers/messages';

const sql = `SELECT u.id as "userId", u.username, s.is_active as "isActive"
FROM users u
JOIN sessions s ON s.user_id = u.id
WHERE token = $1`;

const getSessionInfo = async (token: string): Promise<Api.UserInfo> => {
  const { rows: [userInfo] } = await pool.query(sql, [token]);
  if (!userInfo) {
    throw new ApiError(errors.SESSION_NOT_FOUND, 400);
  }

  const { isActive, ...rest } = userInfo;

  if (!isActive) {
    throw new ApiError(errors.SESSION_INVALID, 400);
  }

  return rest as Api.UserInfo;
};

export default getSessionInfo;
