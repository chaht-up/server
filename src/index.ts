import 'dotenv/config';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';

import { parseCookie } from './helpers/middleware';
import { user, session } from './server/controllers';
import { errors } from './helpers/messages';
import { handleConnect, authenticateSocket } from './socket';

const { PORT = 3000 } = process.env;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.set('trust proxy', 1);
app.use(parseCookie);

app.use('/api/users', user(io));
app.use('/api/sessions', session);

app.all('*', (_, res) => res.status(404).json({ message: errors.NOT_FOUND }));

io.use(authenticateSocket);
io.on('connection', handleConnect(io));

server.listen(PORT);

export default server;
