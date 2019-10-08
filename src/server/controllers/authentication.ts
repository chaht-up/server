import express from 'express';
import {
  createUser,
  authenticateUser,
  createSession,
  destroySession,
} from '../../database';
import { checkContentType, logger } from '../../helpers/middleware';

const { NODE_ENV } = process.env;

const isProduction = !['development', 'test'].includes(NODE_ENV!);

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
      const userId = await authenticateUser(username, password);
      const token = await createSession(userId);
      return res
        .status(201)
        .cookie('session', token, {
          signed: true,
          sameSite: true,
          httpOnly: true,
          secure: isProduction,
        })
        .json({ message: 'Login successful.' });
    } catch (e) {
      return res.status(400).json({ message: 'Login unsuccessful.' });
    }
  })
  .post('/logout', async (req, res) => {
    const { session } = req.signedCookies;
    res.cookie('session', '', {
      expires: new Date(),
      httpOnly: true,
      sameSite: true,
      secure: isProduction,
    });
    try {
      await destroySession(session);
      return res.status(200).json({ message: 'Logout successful' });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  });
