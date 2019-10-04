// eslint-disable-next-line no-unused-vars
import express from 'express';
import cookieParser from 'cookie-parser';
import {
  createUser,
  authenticateUser,
  createSession,
  destroySession,
} from '../../database';
import { checkContentType } from '../../helpers/middleware';

export default express.Router()
  .use(
    checkContentType,
    express.json(),
    cookieParser(process.env.COOKIE_SECRET || 'development'),
  )
  .post('/register', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    await createUser(username, password);

    return res.status(201).json({ message: 'User created successfully.' });
  })
  .post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    try {
      const userId = await authenticateUser(username, password);
      const token = await createSession(userId);
      return res
        .status(201)
        .cookie('session', token, {
          signed: true,
          sameSite: true,
          secure: true,
        })
        .json({ message: 'Login successful.' });
    } catch (e) {
      return res.status(400).json({ message: 'Login unsuccessful.' });
    }
  })
  .post('/logout', async (req, res) => {
    const { session } = req.signedCookies;
    res.cookie('session', '', { maxAge: Date.now() });
    try {
      await destroySession(session);
      return res.status(200).json({ message: 'Logout successful' });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  });
