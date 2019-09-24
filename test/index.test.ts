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

  it('responds to the app:load event with all messages', (done) => {
    client.emit('app:load', (messages) => {
      expect(messages.map((m) => m.text)).toEqual(loadMessages);
      done();
    });
  });

  it('receives new messages and emits them globally', (done) => {
    const text = 'please insert girder';

    client.emit('message:post', text);

    client.once('message:new', ({ text: response }) => {
      expect(response).toEqual(text);
      done();
    });
  });

  it('echoes requests', (done) => {
    client.send('howdy');

    client.on('message', (message) => {
      expect(message).toEqual('howdy');
      done();
    });
  });
});
