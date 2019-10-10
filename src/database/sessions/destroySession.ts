import pool from '../pool';
import { errors } from '../../helpers/messages';
import ApiError from '../../helpers/ApiError';

const sql = 'UPDATE sessions SET is_active = false WHERE token = $1 AND is_active';

const destroySession = async (token: string): Promise<void> => {
  const { rowCount } = await pool.query(sql, [token]);
  if (rowCount === 0) {
    throw new ApiError(errors.SESSION_INVALID, 400);
  }
};

export default destroySession;
