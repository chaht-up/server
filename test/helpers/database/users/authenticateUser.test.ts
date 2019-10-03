import { createUser, authenticateUser } from '../../../../src/helpers/database';
import pool from '../../../../src/helpers/database/pool';

describe('createUser', () => {
  beforeEach(async () => {
    const client = await pool.connect();
    await client.query('TRUNCATE TABLE users CASCADE');
    await client.release();
  });

  it('creates a user', async () => {
    await createUser('test', 'anothertest');
    expect(await authenticateUser('test', 'anothertest')).toEqual(true);
  });
});
