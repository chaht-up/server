import pool from '../pool';
import ApiError from '../../helpers/ApiError';

const sql = 'SELECT username FROM users WHERE id = $1';

const getUserById = async (id: number): Promise<Api.UserEntry> => {
  const { rows: [user] } = await pool.query(sql, [id]);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  return user;
};

export default getUserById;
