import server from '../../../src';
import request from '../../helpers/request';
import pool from '../../../src/database/pool';
import { createUser, createSession } from '../../../src/database';

const { PORT = 3000 } = process.env;

describe('authentication controller', () => {
  let userId = 0;
  let cookie = [];

  beforeAll(async () => {
    await pool.query('TRUNCATE TABLE users CASCADE');
    userId = await createUser('session_test', 'abcd');
    const { res: loginRes } = await request({
      port: Number(PORT),
      path: '/api/login',
      method: 'POST',
      body: {
        username: 'session_test',
        password: 'abcd',
      },
    });

    cookie = loginRes.headers['set-cookie'];
  });

  afterAll((done) => {
    server.close(done);
  });

  it('returns the session info', async () => {
    const { res: sessionInfoRes, body } = await request({
      port: Number(PORT),
      path: '/api/session',
      method: 'GET',
      headers: {
        Cookie: cookie,
      },
    });

    expect(sessionInfoRes.statusCode).toEqual(200);
    expect(body.userId).toEqual(userId);
    expect(body.username).toEqual('session_test');
  });

  it('handles bad cookies', async () => {
    const { res: sessionInfoRes, body } = await request({
      port: Number(PORT),
      path: '/api/session',
      method: 'GET',
      headers: {
        Cookie: 'cookie',
      },
    });

    expect(sessionInfoRes.statusCode).toEqual(401);
    expect(body).toEqual({ message: 'Unauthorized.' });
  });
});
