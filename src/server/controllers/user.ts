import express from 'express';
import { createUser } from '../../database';
import { checkContentType, logger } from '../../helpers/middleware';

export default express.Router()
  .use(logger)
  .post('/', checkContentType, async (req, res) => {
    const { username, password } = req.body;

    await createUser(username, password);

    return res.status(201).json({ message: 'User created successfully.' });
  });
