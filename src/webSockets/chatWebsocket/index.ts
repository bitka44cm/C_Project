require('events').captureRejections = true;
import { BaseError, createError } from '../../utils/errors';
import chatEvents from './events';
import { sendError } from './helpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const chatWebsocket = async (socket: any) => {
  //connection is up, let's add a simple simple event
  console.log('Socket is connected');
  try {
    const userInfo = socket.userInfo;

    const userFullName = `${userInfo.name} ${userInfo.surname}`;

    const userId = userInfo.id;

    socket.join(userId);

    chatEvents.userJoinToChat({ socket, userId });

    chatEvents.userLeftFromChat({ socket, userId });

    chatEvents.getChatMessages({ socket });

    chatEvents.sendPrivateMessage({ socket });

    chatEvents.deleteChatHistory({ socket });

    chatEvents.userIsTyping({ socket });

    chatEvents.userEndTyping({ socket });

    chatEvents.readMessage({ socket });

    chatEvents.getNewMessages({ socket, userId });

    chatEvents.editMessage({ socket });

    chatEvents.createChatGroup({ socket, userId, userFullName });

    chatEvents.addUserToChatGroup({ socket, userFullName, authorId: userId });

    chatEvents.removeUserFromChatGroup({ socket, authorId: userId });

    chatEvents.removeChatGroup({ socket });

    chatEvents.editChatGroupName({ socket });

    chatEvents.uploadChatGroupAvatar({ socket });

    chatEvents.leaveFromChatGroup({ socket });

    socket[Symbol.for('nodejs.rejection')] = (err: Error) => {
      if (err instanceof BaseError) {
        return sendError(err, socket);
      }
      const serverError = new createError.InternalServerError({ ...err });
      console.error(JSON.stringify(serverError.toJSON()));
      return sendError(serverError, socket);
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
