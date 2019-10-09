import 'dotenv/config';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import { parseCookie } from './helpers/middleware';
import { authentication, session } from './server/controllers';
import { handleConnect, useAuthentication } from './socket';

const { PORT = 3000 } = process.env;

const app = express();
app.set('trust proxy', 1);
app.use(parseCookie);
app.use('/api', authentication, session);
app.all('*', (_, res) => res.status(404).json({ message: 'Not found.' }));

const server = http.createServer(app);

const io = socketIO(server);
useAuthentication(io);
io.on('connection', handleConnect(io));

server.listen(PORT);

export default server;
