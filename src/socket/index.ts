import socketIO from 'socket.io';
import server from '../server';
import handleConnect from './handleConnect';
import authenticateSocket from './authenticateSocket';

const io = socketIO(server);
io.use(authenticateSocket);
io.on('connection', handleConnect(io));

export default io;
