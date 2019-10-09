import { expect } from 'chai';
import request from '../../helpers/request';
import pool from '../../../src/database/pool';

const { PORT = 3000 } = process.env;

describe('user controller', () => {
  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE users CASCADE');
  });

  it('handles registration requests', async () => {
    const { body, res } = await request({
      port: Number(PORT),
      path: '/api/users',
      method: 'POST',
      body: {
        username: 'test',
        password: 'test',
      },
    });

    expect(res.statusCode).to.eql(201);
    expect(body).to.eql({ message: 'User created successfully.' });
  });

  it('rejects non-json requests', async () => {
    const { body, res } = await request({
      port: Number(PORT),
      path: '/api/users',
      method: 'POST',
      headers: { 'content-type': 'application/xml' },
      body: {
        username: 'test',
        password: 'goodpassword',
      },
    });

    expect(res.statusCode).to.eql(406);
    expect(body).to.eql({ message: 'Content type must be "application/json"' });
  });
});
