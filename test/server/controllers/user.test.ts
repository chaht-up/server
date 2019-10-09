import { expect } from 'chai';
import request from '../../helpers/request';
import pool from '../../../src/database/pool';
import { createUser } from '../../../src/database';

const { PORT = 3000 } = process.env;

describe('user controller', () => {
  describe('POST /api/users', () => {
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

  describe('GET /api/users/:id', () => {
    let userId = 0;
    before(async () => {
      userId = await createUser('test_controller', 'test');
    });

    it('gets a user by ID', async () => {
      const { body, res } = await request({
        port: Number(PORT),
        path: `/api/users/${userId}`,
        method: 'GET',
        headers: {
          'content-type': null,
        },
      });

      expect(res.statusCode).to.eql(200);
      expect(body).to.eql({ username: 'test_controller' });
    });

    it('returns a 404 if not found', async () => {
      const { body, res } = await request({
        port: Number(PORT),
        path: '/api/users/0',
        method: 'GET',
        headers: {
          'content-type': null,
        },
      });

      expect(res.statusCode).to.eql(404);
      expect(body).to.eql({ message: 'User not found' });
    });
  });
});
