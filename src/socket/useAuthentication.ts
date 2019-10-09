// eslint-disable-next-line no-unused-vars
import { Request } from 'express';
import sessionStore from '../helpers/sessionStore';
import { getSessionInfo } from '../database';
import { parseCookie } from '../helpers/middleware';

const useAuthentication = (io: SocketIO.Server) => io.use((socket, next) => {
  const { handshake } = socket;
  parseCookie(handshake as unknown as Request, null!, next);
})
  .use(async (socket, next) => {
    const { session } = (socket.handshake as any).signedCookies;
    try {
      const userId = await getSessionInfo(session);
      sessionStore.set(socket, userId);
      next();
    } catch (e) {
      next(e);
    }
  });

export default useAuthentication;
