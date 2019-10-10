import express from 'express';
import { createUser, getUserById, createSession } from '../../database';
import { checkContentType, logger } from '../../helpers/middleware';
import { COOKIE_OPTS } from '../../helpers/cookies';
import convertError from '../../helpers/convertError';

export default express.Router()
  .use(logger)
  .get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const user = await getUserById(Number(id));
      res.json(user);
    } catch (e) {
      const { message, code } = e.responseData;
      res.status(code).json({ message });
    }
  })
  .post('/', checkContentType, async (req, res) => {
    const { username, password } = req.body;

    try {
      const userInfo = await createUser(username, password);
      const token = await createSession(userInfo.userId);

      return res
        .status(201)
        .cookie('session', token, COOKIE_OPTS)
        .json(userInfo);
    } catch (e) {
      const { code, message } = convertError(e);
      return res.status(code).json({ message });
    }
  });
