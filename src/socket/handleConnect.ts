import { getAllMessages, insertMessage } from '../database';

const handleConnect = (io: SocketIO.Server) => (socket: SocketIO.Socket) => {
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
};

export default handleConnect;
