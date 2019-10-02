import io from 'socket.io-client';
import http from 'http';
import server from '../src';
import pool from '../src/helpers/database/pool';
import seedMessages from './helpers/database/seedMessages';

const { PORT = 3000 } = process.env;

const loadMessages = ['this', 'is', 'only', 'a', 'test'];
let client;

describe('app', () => {
  beforeAll((done) => {
    seedMessages(loadMessages).then(() => {
      client = io(`http://localhost:${PORT}`)
        .on('connect', () => {
          console.log('connected');
          done();
        });
    });
  });

  afterAll((done) => {
    client.close();
    server.close(() => {
      pool.end(() => {
        console.log('done');
        done();
      });
    });
  });

  describe('socket server', () => {
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

  describe('http server', () => {
    it('echos requests', (done) => {
      http
        .request({
          port: PORT,
          host: 'localhost',
          method: 'POST',
        })
        .on('response', (res) => {
          let body = '';
          res
            .on('data', (chunk) => {
              body += chunk.toString('utf8');
            })
            .on('end', () => {
              expect(body).toEqual('ping');
              done();
            })
            .on('error', (err) => {
              throw err;
            });
        })
        .on('error', (err) => {
          throw err;
        })
        .end('ping');
    });
  });
});
