import io from 'socket.io-client';
import server from '../src/index';
import pool from '../src/helpers/database/pool';
import seedMessages from './helpers/database/seedMessages';

const { PORT = 3000 } = process.env;

describe('socket server', () => {
  let client;
  const loadMessages = ['this', 'is', 'only', 'a', 'test'];

  beforeAll((done) => {
    seedMessages(loadMessages).then(() => {
      client = io(`http://localhost:${PORT}`);
      client.on('connect', done);
    });
  });

  afterAll((done) => {
    client.close();
    server.close(() => {
      pool.end(() => {
        done();
      });
    });
  });

  describe('app:load', () => {
    it('responds to the app:load event with all messages', (done) => {
      client.emit('app:load', (messages) => {
        expect(messages.map((m) => m.text)).toEqual(loadMessages);
        done();
      });
    });

    it('handles errors and returns empty array', (done) => {
      const spy = jest.spyOn(pool, 'query')
        .mockImplementationOnce(() => { throw new Error(); });

      client.emit('app:load', (messages) => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(messages).toEqual([]);
        spy.mockRestore();
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

    it('handles errors on insertion and does not send out new message', (done) => {
      const spy = jest.fn();
      const dbSpy = jest.spyOn(pool, 'query')
        .mockImplementationOnce(() => { throw new Error(); });
      const text = 'please insert girder';

      client.emit('message:post', text);
      client.once('message:new', spy);

      setTimeout(() => {
        expect(spy).toHaveBeenCalledTimes(0);
        expect(dbSpy).toHaveBeenCalledTimes(1);
        dbSpy.mockRestore();
        done();
      }, 1000);
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
