import server from '../../../src';
import request from '../../helpers/request';
import pool from '../../../src/database/pool';

const { PORT = 3000 } = process.env;

describe('authentication controller', () => {
  beforeEach(async () => {
    const client = await pool.connect();
    await client.query('TRUNCATE TABLE users CASCADE');
    client.release();
  });

  afterAll((done) => {
    server.close(done);
  });

  it('handles registration requests', async () => {
    const { body, res } = await request({
      port: Number(PORT),
      path: '/api/register',
      method: 'POST',
      body: {
        username: 'test',
        password: 'test',
      },
    });

    expect(res.statusCode).toEqual(201);
    expect(body).toEqual({ message: 'User created successfully.' });
  });

  it('handles a happy registration and login flow', async () => {
    const registerResponse = await request({
      port: Number(PORT),
      path: '/api/register',
      method: 'POST',
      body: {
        username: 'test',
        password: 'goodpassword',
      },
    });

    expect(registerResponse.res.statusCode).toEqual(201);
    expect(registerResponse.body).toEqual({ message: 'User created successfully.' });

    const { body, res } = await request({
      port: Number(PORT),
      path: '/api/login',
      method: 'POST',
      body: {
        username: 'test',
        password: 'goodpassword',
      },
    });

    expect(body).toEqual({ message: 'Login successful.' });
    expect(res.statusCode).toEqual(201);
    expect(res.headers['set-cookie']).not.toBeUndefined();
    const session = res.headers['set-cookie'][0];
    expect(session).toMatch(/^session=[A-Za-z0-9%.-]+; Path=\/; Secure; SameSite=Strict$/);
  });

  it('handles a bad registration and login flow', async () => {
    const registerResponse = await request({
      port: Number(PORT),
      path: '/api/register',
      method: 'POST',
      body: {
        username: 'test',
        password: 'goodpassword',
      },
    });

    expect(registerResponse.res.statusCode).toEqual(201);
    expect(registerResponse.body).toEqual({ message: 'User created successfully.' });

    const { body, res } = await request({
      port: Number(PORT),
      path: '/api/login',
      method: 'POST',
      body: {
        username: 'test',
        password: 'badpassword',
      },
    });

    expect(body).toEqual({ message: 'Login unsuccessful.' });
    expect(res.statusCode).toEqual(400);
    expect(res.headers.cookie).toBeFalsy();
  });

  it('handles a happy registration, login, and logout flow', async () => {
    const registerResponse = await request({
      port: Number(PORT),
      path: '/api/register',
      method: 'POST',
      body: {
        username: 'test',
        password: 'goodpassword',
      },
    });

    expect(registerResponse.res.statusCode).toEqual(201);
    expect(registerResponse.body).toEqual({ message: 'User created successfully.' });

    const loginResponse = await request({
      port: Number(PORT),
      path: '/api/login',
      method: 'POST',
      body: {
        username: 'test',
        password: 'goodpassword',
      },
    });

    expect(loginResponse.body).toEqual({ message: 'Login successful.' });
    expect(loginResponse.res.statusCode).toEqual(201);
    expect(loginResponse.res.headers['set-cookie']).not.toBeUndefined();
    const session = loginResponse.res.headers['set-cookie'][0];
    expect(session).toMatch(/^session=[A-Za-z0-9%.-]+; Path=\/; Secure; SameSite=Strict$/);

    const logoutResponse = await request({
      port: Number(PORT),
      path: '/api/logout',
      method: 'POST',
      headers: {
        Cookie: session,
      },
      body: {
        username: 'test',
        password: 'goodpassword',
      },
    });

    expect(logoutResponse.res.statusCode).toEqual(200);
  });

  it('returns an error when logging out an invalid session', async () => {
    const { body, res } = await request({
      port: Number(PORT),
      path: '/api/logout',
      method: 'POST',
      headers: {
        Cookie: 'Cookie: session=s%3A30ce0bc5-7f02-447b-8c51-d46367025c35.wqu1s9TtvG8x1QZeMiYN4LQzP29milGDwYMwkMFILhc; Path=/; Secure; SameSite=Strict',
      },
      body: {
        username: 'test',
        password: 'goodpassword',
      },
    });

    expect(res.statusCode).toEqual(400);
    expect(body).toEqual({ message: 'Session is invalid' });
  });

  it('rejects non-json requests', async () => {
    const { body, res } = await request({
      port: Number(PORT),
      path: '/api/logout',
      method: 'POST',
      headers: { 'content-type': 'application/xml' },
      body: {
        username: 'test',
        password: 'goodpassword',
      },
    });

    expect(res.statusCode).toEqual(406);
    expect(body).toEqual({ message: 'Content type must be "application/json"' });
  });
});
