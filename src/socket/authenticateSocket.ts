// eslint-disable-next-line no-unused-vars
import { Socket } from 'socket.io';
// eslint-disable-next-line no-unused-vars
import { Request, NextFunction } from 'express';
import sessionStore from '../helpers/sessionStore';
import { getSessionInfo } from '../database';
import { parseCookie } from '../helpers/middleware';

const authenticateSocket = (socket: Socket, next: NextFunction) => {
  parseCookie(socket.handshake as unknown as Request, null!, async (/* err */) => {
    // doesn't seem possible to hit this
    // if (err) return next(err);
    const { session } = (socket.handshake as any).signedCookies;
    try {
      const userId = await getSessionInfo(session);
      sessionStore.set(socket, userId);
      return next();
    } catch (e) {
      return next(e);
    }
  });
};

export default authenticateSocket;
