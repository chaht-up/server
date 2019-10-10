import bcrypt from 'bcrypt';
import { expect } from 'chai';
import { createUser } from '../../../src/database';
import pool from '../../../src/database/pool';
import ApiError from '../../../src/helpers/ApiError';
import { errors } from '../../../src/helpers/messages';

describe('createUser', () => {
  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE users CASCADE');
  });

  it('creates a user', async () => {
    await createUser('test', 'test');
    const { rows: userRows } = await pool.query('SELECT * FROM users');
    expect(userRows.length).to.eql(1);
    const [{ username, id }] = userRows;
    expect(username).to.eql('test');
    const { rows: secretRows } = await pool
      .query('SELECT * FROM user_secrets WHERE user_id = $1', [id]);
    expect(secretRows.length).to.eql(1);
    const [{ password }] = secretRows;
    expect(bcrypt.compareSync('test', password)).to.eql(true);
  });

  it('will not create duplicate users (unique usernames)', async () => {
    try {
      const { userId } = await createUser('test', 'test');
      expect(userId).to.be.a('number');
      await createUser('test', 'test');
      expect(true).to.eql(false);
    } catch (e) {
      expect(e).to.be.instanceOf(ApiError);
      expect(e.message).to.eql(errors.USERNAME_NOT_AVAILABLE);
    }
  });

  it('throws without a password', async () => {
    try {
      await createUser('test', null);
      expect(true).to.eql(false);
    } catch (e) {
      expect(e).to.be.instanceOf(Error);
      expect(e.message).to.eql('data and salt arguments required');
    }
  });
});
