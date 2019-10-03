// eslint-disable-next-line no-unused-vars
import express from 'express';
import { createUser, authenticateUser } from '../../database';

export default express.Router()
  .use(express.json())
  .post('/register', async (req, res) => {
    const { username, password } = req.body;

    await createUser(username, password);

    return res.status(201).json({ message: 'User created successfully.' });
  })
  .post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (await authenticateUser(username, password)) {
      return res.json({ message: 'Login successful.' });
    }

    return res.status(400).json({ message: 'Login unsuccessful.' });
  });
