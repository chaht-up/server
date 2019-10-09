import { expect } from 'chai';
import request from '../../../helpers/request';
import pool from '../../../../src/database/pool';
import { createUser } from '../../../../src/database';

const { PORT = 3000 } = process.env;

describe('session controller', () => {
  let userId = 0;
  let cookie = [];

  describe('GET /api/sessions', () => {
    before(async () => {
      await pool.query('TRUNCATE TABLE users CASCADE');
      userId = await createUser('session_test', 'abcd');
      const { res: loginRes } = await request({
        port: Number(PORT),
        path: '/api/sessions',
        method: 'POST',
        body: {
          username: 'session_test',
          password: 'abcd',
        },
      });

      cookie = loginRes.headers['set-cookie'];
      expect(loginRes.statusCode).to.eql(201);
    });

    it('returns the session info', async () => {
      const { res: sessionInfoRes, body } = await request({
        port: Number(PORT),
        path: '/api/sessions',
        method: 'GET',
        headers: {
          Cookie: cookie,
        },
      });

      expect(sessionInfoRes.statusCode).to.eql(200);
      expect(body.userId).to.eql(userId);
      expect(body.username).to.eql('session_test');
    });

    it('handles bad cookies', async () => {
      const { res: sessionInfoRes, body } = await request({
        port: Number(PORT),
        path: '/api/sessions',
        method: 'GET',
        headers: {
          Cookie: 'cookie',
          'content-type': null,
        },
      });

      expect(sessionInfoRes.statusCode).to.eql(401);
      expect(body).to.eql({ message: 'Unauthorized.' });
    });
  });
});
