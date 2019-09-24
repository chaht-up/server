import socketIO from 'socket.io';

const { PORT = 3000 } = process.env;

const io = socketIO(PORT);

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    socket.emit('message', message);
  });
});

export default io;
