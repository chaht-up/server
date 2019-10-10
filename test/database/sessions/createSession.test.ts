import { expect } from 'chai';
import { createSession, createUser } from '../../../src/database';
import pool from '../../../src/database/pool';

describe('createSession', () => {
  let userId = 0;
  before(async () => {
    await pool.query('TRUNCATE TABLE users CASCADE');
    ({ userId } = await createUser('session_test', 'abcdef'));
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE sessions');
  });

  it('creates a session for a user', async () => {
    const token = await createSession(userId);
    expect(token).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('has the proper fields', async () => {
    const token = await createSession(userId);
    const { rows: [session] } = await pool.query('SELECT * FROM sessions WHERE token = $1', [token]);
    const {
      id,
      user_id: theUserId,
      token: theToken,
      is_active: isActive,
      created_at: createdAt,
      ...rest
    } = session;
    const { toString } = Object.prototype;
    expect(rest).to.eql({});
    expect(theUserId).to.eql(userId);
    expect(toString.call(id)).to.eql('[object Number]');
    expect(theToken).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(toString.call(isActive)).to.eql('[object Boolean]');
    expect(toString.call(createdAt)).to.eql('[object Date]');
  });
});
