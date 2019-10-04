import 'dotenv/config';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import { authentication } from './server/controllers';
import { handleConnect } from './socket';

const { PORT = 3000 } = process.env;

const app = express();
app.set('trust proxy', 1);
app.use('/api', authentication);
app.all('*', (_, res) => res.status(404).json({ message: 'Not found.' }));

const server = http.createServer(app);

const io = socketIO(server);
io.on('connection', handleConnect(io));

server.listen(PORT);

export default server;
