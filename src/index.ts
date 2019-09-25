import 'dotenv/config';
import socketIO from 'socket.io';
import { getAllMessages, insertMessage } from './helpers/database';

const { PORT = 3000 } = process.env;

const io = socketIO(PORT);

io.on('connection', (socket) => {
  socket.on('app:load', async (cb) => {
    try {
      const messages = await getAllMessages();
      cb(messages);
    } catch (e) {
      console.error('Encountered error in "app:load":');
      console.error(e);
      cb([]);
    }
  });

  socket.on('message:post', async (message) => {
    try {
      const record = await insertMessage(message);
      io.emit('message:new', record);
    } catch (e) {
      console.error('Encountered error in "message:post":');
      console.error(e);
    }
  });

  socket.on('message', (message) => {
    socket.send(message);
  });
});

export default io;
