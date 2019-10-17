// eslint-disable-next-line no-unused-vars
import { Request, NextFunction } from 'express';
import sessionStore from '../helpers/sessionStore';
import { getSessionInfo } from '../database';
import { parseCookie } from '../helpers/middleware';

const authenticateSocket = async (socket: SocketIO.Socket, next: NextFunction) => {
  await new Promise((r) => parseCookie(socket.handshake as unknown as Request, null!, r));
  const { session } = (socket.handshake as any).signedCookies;
  try {
    const userId = await getSessionInfo(session);
    sessionStore.set(socket, userId);
    return next();
  } catch (e) {
    return next(e);
  }
};

export default authenticateSocket;
