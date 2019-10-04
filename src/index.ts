import 'dotenv/config';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import { authentication } from './server/controllers';
import { handleConnect } from './socket';

const { PORT = 3000 } = process.env;

const app = express();
app.set('trust proxy', 1);

const server = http.createServer(app);

app.use('/api', authentication);
app.all('*', (_, res) => res.status(404).json({ message: 'Not found.' }));

const io = socketIO(server);

server.listen(PORT);

io.on('connection', handleConnect.bind(io));

export default server;
