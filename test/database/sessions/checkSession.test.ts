import { checkSession, createUser, createSession } from '../../../src/database';
import pool from '../../../src/database/pool';

describe('checkSession', () => {
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

  it('validates a session is active and returns the user id', async () => {
    const id = await checkSession(token);
    expect(id).toEqual(userId);
  });

  it('throws an error if the session cannot be found', async () => {
    try {
      // this will fail once every trillion years
      await checkSession('c1945cfc-6f23-4cb4-9562-f39144f16b84');
    } catch (e) {
      expect(e.message).toEqual('Session not found');
    }
  });

  it('throws an error if the session is not active', async () => {
    try {
      await pool.query('UPDATE sessions SET is_active = false WHERE token = $1', [token]);
      // this will fail once every trillion years
      await checkSession(token);
    } catch (e) {
      expect(e.message).toEqual('Session is invalid');
    }
  });
});
