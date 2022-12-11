import { SocketProps } from '..';
import { SOCKET_EVENTS } from '../../constants';
import { MessagesEntity } from '../../db/entities';
import { getRoomUsersIds } from './helpers';
import chatService from './service';

const EMPTY_ARRAY_LENGTH = 0;

class ChatEvents {
  userJoinToChat(options: { socket: SocketProps; userId: string }) {
    try {
      const { socket, userId } = options;
      socket.on(SOCKET_EVENTS.JOIN_TO_CHAT_EVENT, async () => {
        const result = await chatService.userJoinToChat({ userId });

        if (result) {
          socket.broadcast.emit(SOCKET_EVENTS.JOIN_TO_CHAT_EVENT, {
            userId,
          });
        }
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  userLeftFromChat(options: { socket: SocketProps; userId: string }) {
    try {
      const { socket, userId } = options;

      socket.on(SOCKET_EVENTS.LEFT_FROM_CHAT_EVENT, async () => {
        const result = await chatService.userLeftFromChat({ userId });

        if (result) {
          socket.broadcast.emit(SOCKET_EVENTS.LEFT_FROM_CHAT_EVENT, { userId });
        }
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getChatMessages(options: { socket: SocketProps }) {
    try {
      const { socket } = options;

      socket.on(SOCKET_EVENTS.GET_CHAT_MESSAGES_EVENT, async (getCurrentMessageData) => {
        const { roomId, filter = '' } = getCurrentMessageData;

        const result = await chatService.getChatMessages({
          roomId,
          filter,
        });

        if (result) {
          socket.emit(SOCKET_EVENTS.GET_CHAT_MESSAGES_EVENT, result);
        }
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  sendPrivateMessage(options: { socket: SocketProps }) {
    const { socket } = options;
    try {
      socket.on(
        SOCKET_EVENTS.SEND_PRIVATE_MESSAGE_EVENT,
        async (privateMessageData: { authorId: string; text: string; roomId: string }) => {
          const { authorId, text, roomId } = privateMessageData;

          const result = await chatService.sendPrivateMessage({
            authorId,
            text,
            roomId,
          });

          if (result) {
            const usersRoomIds = await getRoomUsersIds(roomId);

            if (usersRoomIds.length > EMPTY_ARRAY_LENGTH) {
              usersRoomIds.forEach((id: string) => {
                socket.to(id).emit(SOCKET_EVENTS.SEND_PRIVATE_MESSAGE_EVENT, {
                  result,
                });
              });

              socket.emit(SOCKET_EVENTS.SEND_PRIVATE_MESSAGE_EVENT, {
                result,
              });
            }
          }
        },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  deleteChatHistory(options: { socket: SocketProps }) {
    try {
      const { socket } = options;

      socket.on(SOCKET_EVENTS.DELETE_CHAT_HISTORY_EVENT, async (deletingChatData) => {
        const { roomId } = deletingChatData;

        const result = await chatService.deleteChatHistory({
          roomId,
        });

        if (result) {
          const usersRoomIds = await getRoomUsersIds(roomId);

          if (usersRoomIds.length > EMPTY_ARRAY_LENGTH) {
            usersRoomIds.forEach((id: string) => {
              socket.to(id).emit(SOCKET_EVENTS.DELETE_CHAT_HISTORY_EVENT, {
                result,
              });
            });
            socket.emit(SOCKET_EVENTS.DELETE_CHAT_HISTORY_EVENT, {
              result,
            });
          }
        }
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  userIsTyping(options: { socket: SocketProps }) {
    try {
      const { socket } = options;

      socket.on(SOCKET_EVENTS.USER_IS_TYPING_EVENT, async (typingData) => {
        const { userId, selectedUserId } = typingData;

        socket
          .to(selectedUserId)
          .emit(SOCKET_EVENTS.USER_IS_TYPING_EVENT, { userId, isTyping: true });
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  userEndTyping(options: { socket: SocketProps }) {
    try {
      const { socket } = options;

      socket.on(SOCKET_EVENTS.USER_END_TYPING_EVENT, async (typingData) => {
        const { userId, selectedUserId } = typingData;
        socket
          .to(selectedUserId)
          .emit(SOCKET_EVENTS.USER_IS_TYPING_EVENT, { userId, isTyping: false });
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  readMessage(options: { socket: SocketProps }) {
    try {
      const { socket } = options;

      socket.on(
        SOCKET_EVENTS.READ_MESSAGE_EVENT,
        async (readMessageData: { newMessages: MessagesEntity[]; roomId: string }) => {
          const { newMessages, roomId } = readMessageData;

          const readMessageResult = await chatService.readMessage({ newMessages, roomId });

          if (readMessageResult) {
            const usersRoomIds = await getRoomUsersIds(roomId);
            if (usersRoomIds.length > EMPTY_ARRAY_LENGTH) {
              usersRoomIds.forEach((id: string) => {
                socket.to(id).emit(SOCKET_EVENTS.READ_MESSAGE_EVENT, {
                  readMessageResult,
                });
              });
              socket.emit(SOCKET_EVENTS.READ_MESSAGE_EVENT, {
                readMessageResult,
              });
            }
          }
        },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getNewMessages(options: { socket: SocketProps; userId: string }) {
    try {
      const { socket, userId } = options;

      socket.on(
        SOCKET_EVENTS.GET_NEW_MESSAGES_EVENT,
        async (getNewMessagesData: { roomId: string }) => {
          const { roomId } = getNewMessagesData;

          const result = await chatService.getNewMessages({
            userId,
            roomId,
          });

          if (result) {
            const usersRoomIds = await getRoomUsersIds(roomId);
            if (usersRoomIds.length > EMPTY_ARRAY_LENGTH) {
              usersRoomIds.forEach((id: string) => {
                socket.to(id).emit(SOCKET_EVENTS.GET_NEW_MESSAGES_EVENT, {
                  result,
                });
              });
              socket.emit(SOCKET_EVENTS.GET_NEW_MESSAGES_EVENT, {
                result,
              });
            }
          }
        },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  editMessage(options: { socket: SocketProps }) {
    try {
      const { socket } = options;
      socket.on(
        SOCKET_EVENTS.EDIT_MESSAGE_EVENT,
        async (getEditedMessageData: { text: string; roomId: string; messageId: string }) => {
          const { text, roomId, messageId } = getEditedMessageData;

          const result = await chatService.editMessage({ text, messageId, roomId });

          if (result) {
            const usersRoomIds = await getRoomUsersIds(roomId);
            if (usersRoomIds.length > EMPTY_ARRAY_LENGTH) {
              usersRoomIds.forEach((id: string) => {
                socket.to(id).emit(SOCKET_EVENTS.EDIT_MESSAGE_EVENT, {
                  result,
                });
              });
              socket.emit(SOCKET_EVENTS.EDIT_MESSAGE_EVENT, {
                result,
              });
            }
          }
        },
      );
    } catch (err) {
      console.error(err);
    }
  }

  createChatGroup(options: { socket: SocketProps; userId: string; userFullName: string }) {
    try {
      const { socket, userId, userFullName } = options;
      socket.on(
        SOCKET_EVENTS.CREATE_CHAT_GROUP_EVENT,
        async (createChatGroupData: { name: string; userIds: string[] }) => {
          const { name, userIds } = createChatGroupData;

          userIds.push(userId);

          const result = await chatService.createChatGroup({
            name,
            userIds,
            authorName: userFullName,
            authorId: userId,
          });

          if (result) {
            userIds.forEach((m) => {
              socket.to(m).emit(SOCKET_EVENTS.CREATE_CHAT_GROUP_EVENT, result);
            });
            socket.emit(SOCKET_EVENTS.CREATE_CHAT_GROUP_EVENT, result);
          }
        },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  addUserToChatGroup(options: { socket: SocketProps; userFullName: string; authorId: string }) {
    try {
      const { socket, userFullName, authorId } = options;
      socket.on(
        SOCKET_EVENTS.ADD_USER_TO_CHAT_GROUP_EVENT,
        async (addUserToChatGroupData: { newUserIds: string[]; roomId: string }) => {
          const { newUserIds, roomId } = addUserToChatGroupData;

          const result = await chatService.addUserToChatGroup({
            roomId,
            newUserIds,
            authorName: userFullName,
            authorId,
          });

          if (result) {
            const usersRoomIds = await getRoomUsersIds(roomId);

            if (usersRoomIds.length > EMPTY_ARRAY_LENGTH) {
              usersRoomIds.forEach((uId: string) => {
                socket.to(uId).emit(SOCKET_EVENTS.ADD_USER_TO_CHAT_GROUP_EVENT, result);
              });
              socket.emit(SOCKET_EVENTS.ADD_USER_TO_CHAT_GROUP_EVENT, result);
            }
          }
        },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  removeUserFromChatGroup(options: { socket: SocketProps; authorId: string }) {
    try {
      const { socket, authorId } = options;
      socket.on(
        SOCKET_EVENTS.REMOVE_USER_FROM_CHAT_GROUP_EVENT,
        async (removeChatGroupData: { userId: string; roomId: string }) => {
          const { userId, roomId } = removeChatGroupData;

          const result = await chatService.removeUserFromChatGroup({ roomId, userId, authorId });

          if (result) {
            const usersRoomIds = await getRoomUsersIds(roomId);

            if (usersRoomIds.length > EMPTY_ARRAY_LENGTH) {
              usersRoomIds.forEach((uId: string) => {
                socket.to(uId).emit(SOCKET_EVENTS.REMOVE_USER_FROM_CHAT_GROUP_EVENT, result);
              });
              socket.emit(SOCKET_EVENTS.REMOVE_USER_FROM_CHAT_GROUP_EVENT, result);
            }
          }
        },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  removeChatGroup(options: { socket: SocketProps }) {
    try {
      const { socket } = options;
      socket.on(
        SOCKET_EVENTS.REMOVE_CHAT_GROUP_EVENT,
        async (removeUserFromChatGroupData: { roomId: string }) => {
          const { roomId } = removeUserFromChatGroupData;

          const usersRoomIds = await getRoomUsersIds(roomId);

          const result = await chatService.removeChatGroup({ roomId });

          if (result && usersRoomIds.length > EMPTY_ARRAY_LENGTH) {
            usersRoomIds.forEach((uId: string) => {
              socket.to(uId).emit(SOCKET_EVENTS.REMOVE_CHAT_GROUP_EVENT, result);
            });
            socket.emit(SOCKET_EVENTS.REMOVE_CHAT_GROUP_EVENT, result);
          }
        },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  editChatGroupName(options: { socket: SocketProps }) {
    try {
      const { socket } = options;
      socket.on(
        SOCKET_EVENTS.EDIT_CHAT_GROUP_NAME_EVENT,
        async (editChatGroupNameData: { newName: string; roomId: string }) => {
          const { newName, roomId } = editChatGroupNameData;

          const result = await chatService.editChatGroupName({ roomId, newName });

          if (result) {
            const usersRoomIds = await getRoomUsersIds(roomId);

            if (usersRoomIds.length > EMPTY_ARRAY_LENGTH) {
              usersRoomIds.forEach((uId: string) => {
                socket.to(uId).emit(SOCKET_EVENTS.EDIT_CHAT_GROUP_NAME_EVENT, result);
              });
              socket.emit(SOCKET_EVENTS.EDIT_CHAT_GROUP_NAME_EVENT, result);
            }
          }
        },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  uploadChatGroupAvatar(options: { socket: SocketProps }) {
    try {
      const { socket } = options;
      socket.on(
        SOCKET_EVENTS.UPLOAD_CHAT_GROUP_AVATAR_EVENT,
        async (uploadChatGroupImgData: { groupImg: File; roomId: string }) => {
          const { groupImg, roomId } = uploadChatGroupImgData;

          const result = await chatService.uploadChatGroupImg({ roomId, groupImg });

          if (result) {
            const usersRoomIds = await getRoomUsersIds(roomId);

            if (usersRoomIds.length > EMPTY_ARRAY_LENGTH) {
              usersRoomIds.forEach((uId: string) => {
                socket.to(uId).emit(SOCKET_EVENTS.UPLOAD_CHAT_GROUP_AVATAR_EVENT, result);
              });
              socket.emit(SOCKET_EVENTS.UPLOAD_CHAT_GROUP_AVATAR_EVENT, result);
            }
          }
        },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  leaveFromChatGroup(options: { socket: SocketProps }) {
    try {
      const { socket } = options;
      socket.on(
        SOCKET_EVENTS.LEAVE_FROM_CHAT_GROUP_EVENT,
        async (removeChatGroupData: { userId: string; roomId: string }) => {
          const { userId, roomId } = removeChatGroupData;

          const result = await chatService.leaveFromChatGroup({ roomId, userId });

          if (result) {
            const usersRoomIds = await getRoomUsersIds(roomId);

            if (usersRoomIds.length > EMPTY_ARRAY_LENGTH) {
              usersRoomIds.forEach((uId: string) => {
                socket.to(uId).emit(SOCKET_EVENTS.LEAVE_FROM_CHAT_GROUP_EVENT, result);
              });
              socket.emit(SOCKET_EVENTS.LEAVE_FROM_CHAT_GROUP_EVENT, result);
            }
          }
        },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default new ChatEvents();
