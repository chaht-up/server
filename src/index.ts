import socketIO from 'socket.io';
import { getAllMessages, insertMessage } from './helpers/database';

const { PORT = 3000 } = process.env;

const io = socketIO(PORT);

io.on('connection', (socket) => {
  socket.on('app:load', async (cb) => {
    const messages = await getAllMessages();
    cb(messages);
  });

  socket.on('message:post', async (message) => {
    const record = await insertMessage(message);
    io.emit('message:new', record);
  });

  socket.on('message', (message) => {
    socket.send(message);
  });
});

export default io;
