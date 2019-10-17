import io from 'socket.io-client';
import { expect } from 'chai';
import request from '../../helpers/request';
import pool from '../../../src/database/pool';
import { createUser } from '../../../src/database';
import { errors } from '../../../src/helpers/messages';

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
      expect(res.headers['set-cookie']).to.match(/^session=[A-Za-z0-9%.-]+; Path=\/; HttpOnly; SameSite=Strict$/);
      expect(Number.isInteger(body.userId)).to.eql(true);
      expect(body.username).to.eql('test');
    });

    it('rejects duplicate users', async () => {
      const firstRegister = await request({
        port: Number(PORT),
        path: '/api/users',
        method: 'POST',
        body: {
          username: 'test',
          password: 'test',
        },
      });

      expect(firstRegister.res.statusCode).to.eql(201);

      const { body, res } = await request({
        port: Number(PORT),
        path: '/api/users',
        method: 'POST',
        body: {
          username: 'test',
          password: 'test',
        },
      });

      expect(res.statusCode).to.eql(400);
      expect(res.headers['set-cookie']).to.eql(undefined);
      expect(body.message).to.eql(errors.USERNAME_NOT_AVAILABLE);
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
      expect(body).to.eql({ message: errors.CONTENT_TYPE_INVALID });
    });

    it('emits an event with a new user on registration', async () => {
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
      expect(res.headers['set-cookie']).to.match(/^session=[A-Za-z0-9%.-]+; Path=\/; HttpOnly; SameSite=Strict$/);
      expect(Number.isInteger(body.userId)).to.eql(true);
      expect(body.username).to.eql('test');

      const client = io(`http://localhost:${PORT}`, {
        transportOptions: {
          polling: {
            extraHeaders: { Cookie: res.headers['set-cookie'] },
          },
        },
      });

      const event = new Promise((resolve) => client.once('user:update', resolve));

      const { res: res2, body: body2 } = await request({
        port: Number(PORT),
        path: '/api/users',
        method: 'POST',
        body: {
          username: 'test2',
          password: 'test',
        },
      });

      expect(res2.statusCode).to.eql(201);

      const { userId, username } = await event;
      expect(userId).to.eql(body2.userId);
      expect(username).to.eql(body2.username);
    });
  });

  describe('GET /api/users/:id', () => {
    let userId = 0;
    before(async () => {
      ({ userId } = await createUser('test_controller', 'test'));
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
      expect(body).to.eql({ message: errors.USER_NOT_FOUND });
    });
  });
});
