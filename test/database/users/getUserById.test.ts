import { expect } from 'chai';
import { getUserById, createUser } from '../../../src/database';
import pool from '../../../src/database/pool';
import ApiError from '../../../src/helpers/ApiError';

describe('getUserById', () => {
  let userId = 0;

  before(async () => {
    await pool.query('TRUNCATE TABLE users CASCADE');
    userId = await createUser('getTest', 'test');
  });

  it('gets users by their id', async () => {
    const { username } = await getUserById(userId);
    expect(username).to.eql('getTest');
  });

  it('throws an ApiError with a 404 when not found', async () => {
    try {
      await getUserById(0);
      expect(true).to.eql(false);
    } catch (e) {
      expect(e).to.be.instanceOf(ApiError);
      const { message, code } = e.responseData;
      expect(message).to.eql('User not found');
      expect(code).to.eql(404);
    }
  });
});
