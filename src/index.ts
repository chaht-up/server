import 'dotenv/config';
import http from 'http';
import cookieParser from 'cookie-parser';
import express, { Request } from 'express';
import socketIO from 'socket.io';
import { authentication } from './server/controllers';
import { handleConnect } from './socket';
import { retrieveSessionInfo } from './database';
import sessionStore from './helpers/sessionStore';

const { PORT = 3000 } = process.env;

const parseCookie = cookieParser(process.env.COOKIE_SECRET || 'development');

const app = express();
app.set('trust proxy', 1);
app.use(parseCookie);
app.use('/api', authentication);
app.all('*', (_, res) => res.status(404).json({ message: 'Not found.' }));

const server = http.createServer(app);

const io = socketIO(server);

io
  .use((socket, next) => {
    const { handshake } = socket;
    parseCookie(handshake as unknown as Request, null!, next);
  })
  .use(async (socket, next) => {
    const { session } = (socket.handshake as any).signedCookies;
    try {
      const userId = await retrieveSessionInfo(session);
      sessionStore.set(socket, userId);
      next();
    } catch (e) {
      next(e);
    }
  });

io.on('connection', handleConnect(io));

server.listen(PORT);

export default server;
