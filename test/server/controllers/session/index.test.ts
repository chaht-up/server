import { expect } from 'chai';
import request from '../../../helpers/request';
import pool from '../../../../src/database/pool';
import { createUser } from '../../../../src/database';
import { errors } from '../../../../src/helpers/messages';

const { PORT = 3000 } = process.env;

describe('session controller', () => {
  let userId = 0;
  before(async () => {
    await pool.query('TRUNCATE TABLE users CASCADE');
    ({ userId } = await createUser('test', 'goodpassword'));
  });

  beforeEach(() => pool.query('TRUNCATE TABLE sessions'));

  it('handles login requests', async () => {
    const { body, res } = await request({
      port: Number(PORT),
      path: '/api/sessions',
      method: 'POST',
      body: {
        username: 'test',
        password: 'goodpassword',
      },
    });

    expect(res.statusCode).to.eql(201);
    expect(res.headers['set-cookie'].length).to.eql(1);
    const session = res.headers['set-cookie'][0];
    expect(session).to.match(/^session=[A-Za-z0-9%.-]+; Path=\/; HttpOnly; SameSite=Strict$/);
    expect(body.userId).to.eql(userId);
    expect(body.username).to.eql('test');
  });

  it('handles bad login requests', async () => {
    const { body, res } = await request({
      port: Number(PORT),
      path: '/api/sessions',
      method: 'POST',
      body: {
        username: 'test',
        password: 'badpassword',
      },
    });

    expect(body).to.eql({ message: errors.LOGIN_UNSUCCESSFUL });
    expect(res.statusCode).to.eql(400);
    expect(res.headers.cookie).to.eql(undefined);
  });

  it('handles login and logout flow', async () => {
    const loginResponse = await request({
      port: Number(PORT),
      path: '/api/sessions',
      method: 'POST',
      body: {
        username: 'test',
        password: 'goodpassword',
      },
    });

    expect(loginResponse.body.userId).to.eql(userId);
    expect(loginResponse.body.username).to.eql('test');
    expect(loginResponse.res.statusCode).to.eql(201);
    expect(loginResponse.res.headers['set-cookie'].length).to.eql(1);
    const session = loginResponse.res.headers['set-cookie'][0];
    expect(session).to.match(/^session=[A-Za-z0-9%.-]+; Path=\/; HttpOnly; SameSite=Strict$/);

    const logoutResponse = await request({
      port: Number(PORT),
      path: '/api/sessions',
      method: 'DELETE',
      headers: {
        Cookie: session,
      },
    });

    const sql = 'SELECT s.is_active as "isActive" FROM sessions s JOIN users u ON u.id = s.user_id';
    const { rows: dbSessions } = await pool.query(sql);

    expect(dbSessions.length).to.eql(1);
    expect(dbSessions[0].isActive).to.eql(false);
    expect(logoutResponse.res.statusCode).to.eql(200);
    expect(logoutResponse.res.headers['set-cookie'].length).to.eql(1);

    const closedSession = logoutResponse.res.headers['set-cookie'][0];
    const today = new Date().toUTCString();
    const re = new RegExp(`^session=; Path=\\/; Expires=${today}; HttpOnly; SameSite=Strict$`);
    expect(closedSession).to.match(re);
  });

  it('returns an error when logging out an invalid session', async () => {
    const { body, res } = await request({
      port: Number(PORT),
      path: '/api/sessions',
      method: 'DELETE',
      headers: {
        Cookie: 'Cookie: session=s%3A30ce0bc5-7f02-447b-8c51-d46367025c35.wqu1s9TtvG8x1QZeMiYN4LQzP29milGDwYMwkMFILhc; Path=/; HttpOnly; SameSite=Strict',
      },
    });

    expect(res.statusCode).to.eql(400);
    expect(body).to.eql({ message: errors.SESSION_INVALID });
  });

  it('rejects non-json requests', async () => {
    const { body, res } = await request({
      port: Number(PORT),
      path: '/api/sessions',
      method: 'POST',
      headers: { 'content-type': 'application/xml' },
    });

    expect(res.statusCode).to.eql(406);
    expect(body).to.eql({ message: errors.INVALID_CONTENT_TYPE });
  });
});
