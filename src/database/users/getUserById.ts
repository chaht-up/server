import pool from '../pool';
import ApiError from '../../helpers/ApiError';
import { errors } from '../../helpers/messages';

const sql = 'SELECT username FROM users WHERE id = $1';

const getUserById = async (id: number): Promise<Api.UserEntry> => {
  const { rows: [user] } = await pool.query(sql, [id]);

  if (!user) {
    throw new ApiError(errors.USER_NOT_FOUND, 404);
  }

  return user;
};

export default getUserById;
