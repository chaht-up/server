import { insertMessage } from '../../../database';
import sessionStore from '../../../helpers/sessionStore';

const messagePost: Api.EventTuple = [
  'message:post',
  (io, socket) => async (message) => {
    const record = await insertMessage(message, sessionStore.get(socket)!.userId);
    io.emit('message:new', record);
  },
];

export default messagePost;
