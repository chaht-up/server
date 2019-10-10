import 'dotenv/config';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import { parseCookie } from './helpers/middleware';
import { user, session } from './server/controllers';
import { handleConnect, useAuthentication } from './socket';
import { errors } from './helpers/messages';

const { PORT = 3000 } = process.env;

const app = express();
app.set('trust proxy', 1);
app.use(parseCookie);
app.use('/api/users', user);
app.use('/api/sessions', session);
app.all('*', (_, res) => res.status(404).json({ message: errors.NOT_FOUND }));

const server = http.createServer(app);

const io = socketIO(server);
useAuthentication(io);
io.on('connection', handleConnect(io));

server.listen(PORT);

export default server;
