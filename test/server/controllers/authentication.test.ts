import request from '../../helpers/request';
import pool from '../../../src/database/pool';

const { PORT = 3000 } = process.env;

describe('authentication controller', () => {
  beforeEach(async () => {
    const client = await pool.connect();
    await client.query('TRUNCATE TABLE users CASCADE');
    client.release();
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
});
