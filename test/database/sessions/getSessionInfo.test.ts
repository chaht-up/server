import { expect } from 'chai';
import { getSessionInfo, createUser, createSession } from '../../../src/database';
import pool from '../../../src/database/pool';

describe('getSessionInfo', () => {
  let userId = 0;
  let token = '';
  before(async () => {
    await pool.query('TRUNCATE TABLE users CASCADE');
    ({ userId } = await createUser('session_test', 'abcdef'));
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE sessions');
    token = await createSession(userId);
  });

  it('validates a session is active and returns the user id', async () => {
    const { userId: id, username } = await getSessionInfo(token);
    expect(id).to.eql(userId);
    expect(username).to.eql('session_test');
  });

  it('throws an error if the session cannot be found', async () => {
    try {
      // this will fail once every trillion years
      await getSessionInfo('c1945cfc-6f23-4cb4-9562-f39144f16b84');
    } catch (e) {
      expect(e.message).to.eql('Session not found');
    }
  });

  it('throws an error if the session is not active', async () => {
    try {
      await pool.query('UPDATE sessions SET is_active = false WHERE token = $1', [token]);
      // this will fail once every trillion years
      await getSessionInfo(token);
    } catch (e) {
      expect(e.message).to.eql('Session is invalid');
    }
  });
});
