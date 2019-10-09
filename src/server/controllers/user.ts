import express from 'express';
import { createUser, getUserById } from '../../database';
import { checkContentType, logger } from '../../helpers/middleware';

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

    await createUser(username, password);

    return res.status(201).json({ message: 'User created successfully.' });
  });
