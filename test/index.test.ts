import { expect } from 'chai';
import io from 'socket.io-client';
import '../src';
import seedMessages from './helpers/seedMessages';
import request from './helpers/request';
import { createUser } from '../src/database';
import pool from '../src/database/pool';


const { PORT = 3000 } = process.env;

const loadMessages = ['this', 'is', 'only', 'a', 'test'];

describe('app', () => {
  let client;

  before(async () => {
    await pool.query('TRUNCATE TABLE users CASCADE');
    await seedMessages(loadMessages);
    await createUser('test', 'test');

    const loginResponse = await request({
      port: Number(PORT),
      method: 'POST',
      path: '/api/sessions',
      body: {
        username: 'test',
        password: 'test',
      },
    });

    const session = loginResponse.res.headers['set-cookie'][0];

    client = io(`http://localhost:${PORT}`, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Cookie: session,
          },
        },
      },
    });
  });

  after(async () => {
    await client.close();
  });

  describe('socket server', () => {
    describe('app:load', () => {
      it('responds to the app:load event with all messages', async () => {
        await seedMessages(loadMessages);
        await new Promise((resolve) => {
          client.emit('app:load', ({ messages, users }) => {
            for (const [id, user] of Object.entries(users)) {
              expect(Number.isInteger(Number(id))).to.eql(true);
              const { username, ...rest } = user as any;
              expect(typeof username).to.eql('string');
              expect(rest).to.eql({});
            }
            expect(messages.map((m) => m.text)).to.eql(loadMessages);
            resolve();
          });
        });
      });
    });

    describe('mesage:post', () => {
      it('receives new messages and emits them globally', (done) => {
        const text = 'please insert girder';

        client.emit('message:post', text);

        client.once('message:new', ({ text: response }) => {
          expect(response).to.eql(text);
          done();
        });
      });
    });

    describe('echo', () => {
      it('echoes requests', (done) => {
        client.send('howdy');

        client.on('message', (message) => {
          expect(message).to.eql('howdy');
          done();
        });
      });
    });

    describe('connection', () => {
      it('will not connect without a session', (done) => {
        io(`http://localhost:${PORT}`)
          .on('error', (e) => {
            expect(e).to.eql('Session not found');
            done();
          });
      });
    });
  });

  describe('http server', () => {
    it('handles 404s', async () => {
      const { res, body } = await request({ port: Number(PORT), path: '/api/home', method: 'POST' });

      expect(res.statusCode).to.eql(404);
      expect(body).to.eql({ message: 'Not found.' });
    });
  });
});
