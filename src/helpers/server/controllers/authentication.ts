// eslint-disable-next-line no-unused-vars
import express from 'express';
import cookieParser from 'cookie-parser';
import { createUser, authenticateUser } from '../../../database';
import createSession from '../../../database/sessions/createSession';

export default express.Router()
  .use(
    express.json(),
    cookieParser(process.env.COOKIE_SECRET || 'development'),
  )
  .post('/register', async (req, res) => {
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
  });
