import request from '../../helpers/request';
import pool from '../../../src/helpers/database/pool';

const { PORT = 3000 } = process.env;

describe('authentication controller', () => {
  beforeEach(async () => {
    const client = await pool.connect();
    await client.query('TRUNCATE TABLE users CASCADE');
    await client.release();
  });

  it('handles registration requests', async () => {
    const response = await request({
      port: Number(PORT),
      path: '/api/register',
      method: 'POST',
      body: {
        username: 'test',
        password: 'test',
      },
    });

    expect(response).toEqual({ code: 201, body: { message: 'User created successfully.' } });
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

    expect(registerResponse).toEqual({ code: 201, body: { message: 'User created successfully.' } });

    const { body, code } = await request({
      port: Number(PORT),
      path: '/api/login',
      method: 'POST',
      body: {
        username: 'test',
        password: 'goodpassword',
      },
    });

    expect(body).toEqual({ message: 'Login successful.' });
    expect(code).toEqual(200);
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

    expect(registerResponse).toEqual({ code: 201, body: { message: 'User created successfully.' } });

    const { body, code } = await request({
      port: Number(PORT),
      path: '/api/login',
      method: 'POST',
      body: {
        username: 'test',
        password: 'badpassword',
      },
    });

    expect(body).toEqual({ message: 'Login unsuccessful.' });
    expect(code).toEqual(400);
  });
});
