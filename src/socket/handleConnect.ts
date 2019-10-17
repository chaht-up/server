import events from './events';

const handleConnect = (io: SocketIO.Server) => (socket: SocketIO.Socket) => {
  for (const [eventName, handler] of events) {
    socket.on(eventName, handler(io, socket));
  }

  socket.on('message', (message, cb) => {
    cb(message);
  });
};

export default handleConnect;
