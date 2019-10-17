// eslint-disable-next-line no-unused-vars
import { Server, Socket } from 'socket.io';
import events from './events';

const handleConnect = (io: Server) => (socket: Socket) => {
  for (const [eventName, handler] of events) {
    socket.on(eventName, handler(io, socket));
  }

  socket.on('message', (message, cb) => {
    cb(message);
  });
};

export default handleConnect;
