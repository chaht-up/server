import { getAllMessages, insertMessage } from '../database';

export default function handleConnect(this: SocketIO.Server, socket: SocketIO.Socket) {
  socket.on('app:load', async (cb) => {
    const messages = await getAllMessages();
    cb(messages);
  });

  socket.on('message:post', async (message) => {
    const record = await insertMessage(message);
    if (record.id !== 0) {
      this.emit('message:new', record);
    }
  });

  socket.on('message', (message) => {
    socket.send(message);
  });
}
