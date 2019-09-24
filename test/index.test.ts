import io from 'socket.io-client';
import server from '../src/index';

describe('socket server', () => {
  let client;

  beforeAll(() => {
    client = io(`http://localhost:${3000}`);
  });

  afterAll((done) => {
    client.close();
    server.close(done);
  });

  it('echoes requests', (done) => {
    client.emit('message', 'howdy');

    client.on('message', (message) => {
      expect(message).toEqual('howdy');
      done();
    });
  });
});
