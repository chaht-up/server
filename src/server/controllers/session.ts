import express from 'express';
import { logger } from '../../helpers/middleware';
import { nullCookie } from '../../helpers/cookies';
import { getSessionInfo } from '../../database';

export default express.Router()
  .use(logger)
  .get('/session', async (req, res) => {
    const { session } = req.signedCookies;

    if (!session) {
      return res.status(401)
        .cookie('session', '', nullCookie())
        .json({ message: 'Unauthorized.' });
    }

    const sessionInfo = await getSessionInfo(session);
    return res.json(sessionInfo);
  });
