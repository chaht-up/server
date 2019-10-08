import { getAllMessages, insertMessage } from '../database';
import sessionStore from '../helpers/sessionStore';

const handleConnect = (io: SocketIO.Server) => (socket: SocketIO.Socket) => {
  socket.on('app:load', async (cb) => {
    const messages = await getAllMessages();
    cb(messages);
  });

  socket.on('message:post', async (message) => {
    const record = await insertMessage(message, sessionStore.get(socket));
    io.emit('message:new', record);
  });

  socket.on('message', (message) => {
    socket.send(message);
  });
};

export default handleConnect;
