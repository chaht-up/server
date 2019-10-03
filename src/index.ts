import 'dotenv/config';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import { getAllMessages, insertMessage } from './helpers/database';
import { authentication } from './helpers/server/controllers';

const { PORT = 3000 } = process.env;

const app = express();
const server = http.createServer(app);

app.use('/api', authentication);
app.all('*', (_, res) => res.status(404).json({ message: 'Not found.' }));

const io = socketIO(server);

server.listen(PORT);

io.on('connection', (socket) => {
  socket.on('app:load', async (cb) => {
    const messages = await getAllMessages();
    cb(messages);
  });

  socket.on('message:post', async (message) => {
    const record = await insertMessage(message);
    if (record.id !== 0) {
      io.emit('message:new', record);
    }
  });

  socket.on('message', (message) => {
    socket.send(message);
  });
});

export default server;
