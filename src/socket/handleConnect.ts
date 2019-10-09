import { getAllMessages, insertMessage, getUserDictionary } from '../database';
import sessionStore from '../helpers/sessionStore';

const handleConnect = (io: SocketIO.Server) => (socket: SocketIO.Socket) => {
  socket.on('app:load', async (cb) => {
    const [messages, users] = await Promise.all([getAllMessages(), getUserDictionary()]);
    cb({ messages, users });
  });

  socket.on('message:post', async (message) => {
    const record = await insertMessage(message, sessionStore.get(socket)!.userId);
    io.emit('message:new', record);
  });

  socket.on('message', (message) => {
    socket.send(message);
  });
};

export default handleConnect;
