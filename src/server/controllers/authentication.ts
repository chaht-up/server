import express from 'express';
import {
  createUser,
  authenticateUser,
  createSession,
  destroySession,
} from '../../database';
import { checkContentType, logger } from '../../helpers/middleware';
import { IS_PRODUCTION, nullCookie } from '../../helpers/cookies';

export default express.Router()
  .use(
    logger,
    checkContentType,
    express.json(),
  )
  .post('/register', async (req, res) => {
    const { username, password } = req.body;

    await createUser(username, password);

    return res.status(201).json({ message: 'User created successfully.' });
  })
  .post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const userInfo = await authenticateUser(username, password);
      const token = await createSession(userInfo.userId);
      return res
        .status(201)
        .cookie('session', token, {
          signed: true,
          sameSite: true,
          httpOnly: true,
          secure: IS_PRODUCTION,
        })
        .json(userInfo);
    } catch (e) {
      return res.status(400).json({ message: 'Login unsuccessful.' });
    }
  })
  .post('/logout', async (req, res) => {
    const { session } = req.signedCookies;
    res.cookie('session', '', nullCookie());
    try {
      await destroySession(session);
      return res.status(200).json({ message: 'Logout successful' });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  });
