import { destroySession, createUser, createSession } from '../../../src/database';
import pool from '../../../src/database/pool';

describe('destroySession', () => {
  let userId = 0;
  let token = '';
  beforeAll(async () => {
    await pool.query('TRUNCATE TABLE users CASCADE');
    userId = await createUser('session_test', 'abcdef');
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE sessions');
    token = await createSession(userId);
  });

  it('marks a session inactive', async () => {
    let { rows: [{ isActive }] } = await pool.query('SELECT is_active as "isActive" FROM sessions WHERE token = $1', [token]);
    expect(isActive).toBe(true);
    expect(await destroySession(token)).toBeUndefined();
    ({ rows: [{ isActive }] } = await pool.query('SELECT is_active as "isActive" FROM sessions WHERE token = $1', [token]));
    expect(isActive).toBe(false);
  });

  it('throws an error when passed an invalid session', async () => {
    expect(await destroySession(token)).toBeUndefined();
    try {
      await destroySession(token);
    } catch (e) {
      expect(e.message).toEqual('Session is invalid');
    }
  });
});
