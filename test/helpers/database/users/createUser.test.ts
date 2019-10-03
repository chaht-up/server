import bcrypt from 'bcrypt';
import { createUser } from '../../../../src/helpers/database';
import pool from '../../../../src/helpers/database/pool';

describe('createUser', () => {
  let client;

  beforeAll(async () => {
    client = await pool.connect();
  });

  beforeEach(async () => {
    await client.query('TRUNCATE TABLE users CASCADE');
  });

  afterAll(async () => {
    await client.release();
  });

  it('creates a user', async () => {
    await createUser('test', 'test');
    const { rows: userRows } = await client.query('SELECT * FROM users');
    expect(userRows.length).toEqual(1);
    const [{ username, id }] = userRows;
    expect(username).toEqual('test');
    const { rows: secretRows } = await pool
      .query('SELECT * FROM user_secrets WHERE user_id = $1', [id]);
    expect(secretRows.length).toEqual(1);
    const [{ password }] = secretRows;
    expect(bcrypt.compareSync('test', password)).toEqual(true);
  });
});
