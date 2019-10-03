import io from 'socket.io-client';
import pool from '../src/helpers/database/pool';
import seedMessages from './helpers/database/seedMessages';
import request from './helpers/request';

const { PORT = 3000 } = process.env;

const loadMessages = ['this', 'is', 'only', 'a', 'test'];

describe('app', () => {
  let client;
  let pgClient;

  beforeAll(async (done) => {
    pgClient = await pool.connect();
    await seedMessages(loadMessages);

    client = io(`http://localhost:${PORT}`)
      .on('connect', done);
  });

  afterAll(async () => {
    client.close();
    await pgClient.release();
  //   console.log('afterAll done');
  });

  describe('socket server', () => {
    describe('app:load', () => {
      it('responds to the app:load event with all messages', async (done) => {
        await seedMessages(loadMessages);
        client.emit('app:load', (messages) => {
          expect(messages.map((m) => m.text)).toEqual(loadMessages);
          done();
        });
      });
    });

    afterEach(() => jest.restoreAllMocks());

    describe('mesage:post', () => {
      it('receives new messages and emits them globally', (done) => {
        const text = 'please insert girder';

        client.emit('message:post', text);

        client.once('message:new', ({ text: response }) => {
          expect(response).toEqual(text);
          done();
        });
      });
    });

    describe('echo', () => {
      it('echoes requests', (done) => {
        client.send('howdy');

        client.on('message', (message) => {
          expect(message).toEqual('howdy');
          done();
        });
      });
    });
  });

  describe('http server', () => {
    it('handles 404s', async () => {
      const response = await request({ port: Number(PORT), path: '/api/home', method: 'POST' });

      expect(response).toEqual({ code: 404, body: { message: 'Not found.' } });
    });
  });
});
