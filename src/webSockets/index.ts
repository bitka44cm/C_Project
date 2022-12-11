import { Server } from 'http';
import { Socket } from 'socket.io';
const socketIo = require('socket.io');
import { createError } from '../utils/errors';
import { chatWebsocket } from './chatWebsocket';
import express from 'express';
import { RolesAttributes } from '../db/entities/rolesEntity';

export interface SocketProps extends Socket {
  userInfo: {
    id: string;
    name: string;
    surname: string;
    roles: Array<RolesAttributes>;
  };
}

let url = process.env.FRONTEND_URL;
if (process.env.NODE_ENV === 'production') {
  url = process.env.NETLIFY_URL;
}

const webSocketsServer = (expressServerConfiguration: Server | Server | undefined) => {
  const io = socketIo(expressServerConfiguration, {
    cors: {
      origin: url,
    },
  });

  io.use((socket: SocketProps, next: express.NextFunction) => {
    const userInfo = socket.handshake.auth.user;

    if (!userInfo) {
      throw new createError.Unauthenticated();
    }

    if (userInfo) {
      socket.userInfo = userInfo;
      next();
    }
  });

  io.on('connection', async (socket: SocketProps) => {
    chatWebsocket(socket);
  });

  return io;
};

export default webSocketsServer;
