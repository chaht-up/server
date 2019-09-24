import io from 'socket.io-client';
import server from '../src/index';
import pool from '../src/helpers/database/pool';

const { PORT = 3000 } = process.env;

describe('socket server', () => {
  let client;

  beforeAll((done) => {
    client = io(`http://localhost:${PORT}`);
    client.on('connect', done);
  });

  afterAll((done) => {
    client.close();
    server.close(() => {
      pool.end(() => {
        done();
      });
    });
  });

  it('echoes requests', (done) => {
    client.emit('message', 'howdy');

    client.on('message', (message) => {
      expect(message).toEqual('howdy');
      done();
    });
  });
});
