import pool from '../pool';

const sql = 'UPDATE sessions SET is_active = false WHERE token = $1 AND is_active';

const destroySession = async (token: string): Promise<void> => {
  const { rowCount } = await pool.query(sql, [token]);
  if (rowCount === 0) {
    throw new Error('Session is invalid');
  }
};

export default destroySession;
