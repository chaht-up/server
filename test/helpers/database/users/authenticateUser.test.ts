import { createUser, authenticateUser } from '../../../../src/database';
import pool from '../../../../src/database/pool';

describe('createUser', () => {
  let userId = 0;
  beforeAll(async () => {
    const client = await pool.connect();
    await client.query('TRUNCATE TABLE users CASCADE');
    userId = await createUser('test', 'anothertest');
    client.release();
  });

  it('creates a user', async () => {
    expect(await authenticateUser('test', 'anothertest')).toEqual(userId);
  });

  it('throws if the password is wrong', async () => {
    try {
      await authenticateUser('test', 'notTheRightOne');
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual('Invalid credentials');
    }
  });
});
