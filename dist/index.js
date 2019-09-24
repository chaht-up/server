"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const { PORT = 3000 } = process.env;
const io = socket_io_1.default(PORT);
io.on('connection', (socket) => {
    socket.on('message', (message) => {
        socket.emit('message', message);
    });
});
