import { createUser, authenticateUser } from '../../../src/database';
import pool from '../../../src/database/pool';

describe('createUser', () => {
  let userId = 0;

  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE users CASCADE');
    userId = await createUser('test', 'anothertest');
  });

  it('creates a user', async () => {
    const { userId: id, username } = await authenticateUser('test', 'anothertest');
    expect(id).toEqual(userId);
    expect(username).toEqual('test');
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
