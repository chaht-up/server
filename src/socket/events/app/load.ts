import { getAllMessages, getUserDictionary } from '../../../database';

const appLoad: Api.EventTuple = [
  'app:load',
  // eslint-disable-next-line no-unused-vars
  (_io, _socket) => async (cb: Function) => {
    const [messages, users] = await Promise.all([getAllMessages(), getUserDictionary()]);
    cb({ messages, users });
  },
];

export default appLoad;
