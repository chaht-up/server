import express from 'express';
import {
  authenticateUser,
  createSession,
  destroySession,
  getSessionInfo,
} from '../../database';
import { nullCookie, COOKIE_OPTS } from '../../helpers/cookies';
import { logger, checkContentType } from '../../helpers/middleware';

export default express.Router()
  .use(logger)
  .get('/', async (req, res) => {
    const { session } = req.signedCookies;

    if (!session) {
      return res.status(401)
        .cookie('session', '', nullCookie())
        .json({ message: 'Unauthorized.' });
    }

    const sessionInfo = await getSessionInfo(session);
    return res.json(sessionInfo);
  })
  .post('/', checkContentType, async (req, res) => {
    const { username, password } = req.body;
    try {
      const userInfo = await authenticateUser(username, password);
      const token = await createSession(userInfo.userId);
      return res
        .status(201)
        .cookie('session', token, COOKIE_OPTS)
        .json(userInfo);
    } catch (e) {
      return res.status(400).json({ message: 'Login unsuccessful.' });
    }
  })
  .delete('/', async (req, res) => {
    const { session } = req.signedCookies;
    res.cookie('session', '', nullCookie());
    try {
      await destroySession(session);
      return res.status(200).json({ message: 'Logout successful' });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  });
