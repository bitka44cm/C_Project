import Joi from 'joi';
import { faker } from '@faker-js/faker';
import { SOCKET_EVENTS } from '../../constants';
import { EndpointSchema } from '../../interfaces';

const connectionSchema: EndpointSchema = {
  params: Joi.object({
    event: 'connection',
    exampleOfCode: {
      example: 'socket.connect();',
    },
  }).example({
    event: 'connection',
  }),
  response: {
    200: {
      schema: Joi.object({}),
    },
  },
};

const userJoinToChatSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.JOIN_TO_CHAT_EVENT,
  }).example({
    event: SOCKET_EVENTS.JOIN_TO_CHAT_EVENT,
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        broadcastEvent: SOCKET_EVENTS.JOIN_TO_CHAT_EVENT,
        notice: {
          description: 'when user connected to chat other user that connected get event about it',
        },
      }),
    },
  },
};

const userLeftFromChatSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.LEFT_FROM_CHAT_EVENT,
  }).example({
    event: SOCKET_EVENTS.LEFT_FROM_CHAT_EVENT,
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        broadcastEvent: SOCKET_EVENTS.LEFT_FROM_CHAT_EVENT,
        notice: {
          description: 'when user left from chat other user that connected get event about it',
        },
      }),
    },
  },
};

const getChatMessagesSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.GET_CHAT_MESSAGES_EVENT,
  }),
  body: Joi.object({
    roomId: Joi.string().required(),
    filter: Joi.string(),
  }).example({
    recipientId: faker.datatype.uuid(),
    filter: 'hello',
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.GET_CHAT_MESSAGES_EVENT,
        response: {
          id: faker.datatype.uuid(),
          roomMessages: [
            {
              id: faker.datatype.uuid(),
              authorId: faker.datatype.uuid(),
              roomId: faker.datatype.uuid(),
              text: faker.lorem.sentence(),
              isNew: faker.datatype.boolean(),
              isEdit: faker.datatype.boolean(),
              createdAt: faker.date.recent(),
              updatedAt: faker.date.recent(),
              deletedAt: faker.date.recent(),
              sentAuthorMessage: {
                id: faker.datatype.uuid(),
                name: faker.name.firstName(),
                surname: faker.name.lastName(),
                avatarImg: faker.image.imageUrl(),
              },
            },
          ],
        },
        notice: {
          description:
            'Get messages of selected user & and find messages by filter at selected user',
        },
      }),
    },
  },
};

const sendPrivateMessageSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.SEND_PRIVATE_MESSAGE_EVENT,
  }),
  body: Joi.object({
    authorId: Joi.string().uuid().required(),
    roomId: Joi.string().uuid(),
    text: Joi.string(),
  }).example({
    authorId: faker.datatype.uuid(),
    roomId: faker.datatype.uuid(),
    text: faker.lorem.sentence(),
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.SEND_PRIVATE_MESSAGE_EVENT,
        response: [
          {
            id: faker.datatype.uuid(),
            authorId: faker.datatype.uuid(),
            roomId: faker.datatype.uuid(),
            text: faker.lorem.sentence(),
            isNew: faker.datatype.boolean(),
            isEdit: faker.datatype.boolean(),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
            deletedAt: faker.date.recent(),
          },
        ],
        notice: {
          description:
            'After new message would be saved in DB, author of message and recipient will receive all messages with new message like event in getCurrentMessage',
        },
      }),
    },
  },
};

const deleteChatHistorySchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.DELETE_CHAT_HISTORY_EVENT,
  }).example({
    event: SOCKET_EVENTS.DELETE_CHAT_HISTORY_EVENT,
  }),
  body: Joi.object({
    roomId: Joi.string().required(),
  }).example({
    roomId: faker.datatype.uuid(),
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.DELETE_CHAT_HISTORY_EVENT,
        response: { message: 'Chat history was removed', allMessages: [] },
        notice: {
          description:
            'This event is able for manager, after messages that were connected with two user would be deleted, they will receive empty array of messages',
        },
      }),
    },
  },
};

const userTypingSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.USER_IS_TYPING_EVENT,
  }).example({
    event: SOCKET_EVENTS.USER_IS_TYPING_EVENT,
  }),
  body: Joi.object({
    userId: Joi.string().required(),
    selectedUserId: Joi.string().required(),
  }).example({
    userId: faker.datatype.uuid(),
    selectedUserId: faker.datatype.uuid(),
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.USER_IS_TYPING_EVENT,
        response: { userId: faker.datatype.uuid(), isTyping: true },
        notice: {
          description: 'Selected user get event isTyping when user started type',
        },
      }),
    },
  },
};

const userEndTypingSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.USER_END_TYPING_EVENT,
  }).example({
    event: SOCKET_EVENTS.USER_END_TYPING_EVENT,
  }),
  body: Joi.object({
    userId: Joi.string().required(),
    selectedUserId: Joi.string().required(),
  }).example({
    userId: faker.datatype.uuid(),
    selectedUserId: faker.datatype.uuid(),
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.USER_IS_TYPING_EVENT,
        response: { userId: faker.datatype.uuid(), isTyping: false },
        notice: {
          description: 'Selected user get event isTyping when user end type',
        },
      }),
    },
  },
};

const readMessageSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.READ_MESSAGE_EVENT,
  }).example({
    event: SOCKET_EVENTS.READ_MESSAGE_EVENT,
  }),
  body: Joi.object({
    newMessages: Joi.array().items({
      id: Joi.string().uuid(),
      authorId: Joi.string().uuid(),
      roomId: Joi.string().uuid(),
      text: Joi.string().required(),
      isNew: Joi.boolean(),
      isEdit: Joi.boolean(),
      createdAt: Joi.date(),
      updatedAt: Joi.date(),
      deletedAt: Joi.date(),
    }),
    roomId: Joi.string().required(),
  }).example({
    roomId: faker.datatype.uuid(),
    newMessages: [
      {
        id: faker.datatype.uuid(),
        authorId: faker.datatype.uuid(),
        roomId: faker.datatype.uuid(),
        text: faker.lorem.sentence(),
        isNew: true,
        isEdit: faker.datatype.boolean(),
        createdAt: faker.date.soon(),
        updatedAt: faker.date.soon(),
        deletedAt: faker.date.soon(),
      },
    ],
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.READ_MESSAGE_EVENT,
        response: {
          message: 'Message is updated successfully',
          allMessages: [
            {
              id: faker.datatype.uuid(),
              authorId: faker.datatype.uuid(),
              roomId: faker.datatype.uuid(),
              text: faker.lorem.sentence(),
              isNew: faker.datatype.boolean(),
              isEdit: faker.datatype.boolean(),
              createdAt: faker.date.recent(),
              updatedAt: faker.date.recent(),
              deletedAt: faker.date.recent(),
            },
          ],
        },
        notice: {
          description: 'take Array of new messages and set isNew to false',
        },
      }),
    },
  },
};

const getNewMessagesSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.GET_NEW_MESSAGES_EVENT,
  }).example({
    event: SOCKET_EVENTS.GET_NEW_MESSAGES_EVENT,
  }),
  body: Joi.object({
    userId: Joi.string().uuid(),
    roomId: Joi.string().required(),
  }).example({
    roomId: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.GET_NEW_MESSAGES_EVENT,
        response: [
          {
            id: faker.datatype.uuid(),
            authorId: faker.datatype.uuid(),
            recipientId: faker.datatype.uuid(),
            text: faker.lorem.sentence(),
            isNew: true,
            isEdit: faker.datatype.boolean(),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
            deletedAt: faker.date.recent(),
          },
        ],
        notice: {
          description: 'Give an array of new messages',
        },
      }),
    },
  },
};

const editMessageSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.EDIT_MESSAGE_EVENT,
  }).example({
    event: SOCKET_EVENTS.EDIT_MESSAGE_EVENT,
  }),
  body: Joi.object({
    messageId: Joi.string().uuid(),
    roomId: Joi.string().required(),
    text: Joi.string().required(),
  }).example({
    messageId: faker.datatype.uuid(),
    roomId: faker.datatype.uuid(),
    text: faker.lorem.sentence(),
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.EDIT_MESSAGE_EVENT,
        response: [
          {
            id: faker.datatype.uuid(),
            authorId: faker.datatype.uuid(),
            recipientId: faker.datatype.uuid(),
            text: faker.lorem.sentence(),
            isNew: true,
            isEdit: faker.datatype.boolean(),
            createdAt: faker.date.soon(),
            updatedAt: faker.date.recent(),
            deletedAt: faker.date.recent(),
          },
        ],
        notice: {
          description: 'Edit messaged and get an array of new messages',
        },
      }),
    },
  },
};

const createChatGroupSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.CREATE_CHAT_GROUP_EVENT,
  }).example({
    event: SOCKET_EVENTS.CREATE_CHAT_GROUP_EVENT,
  }),
  body: Joi.object({
    name: Joi.string(),
    userIds: Joi.array().items(Joi.string().uuid()),
  }).example({
    name: faker.lorem.word(),
    userIds: [faker.datatype.uuid()],
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.CREATE_CHAT_GROUP_EVENT,
        response: [
          {
            message: 'Group created successfully',
            newGroup: {
              id: faker.datatype.uuid(),
              name: faker.lorem.word(),
              avatarImg: faker.image.imageUrl(),
              roomMessages: [
                {
                  id: faker.datatype.uuid(),
                  authorId: faker.datatype.uuid(),
                  roomId: faker.datatype.uuid(),
                  text: faker.lorem.sentence(),
                  isNew: faker.datatype.boolean(),
                  isEdit: faker.datatype.boolean(),
                  createdAt: faker.date.recent(),
                  updatedAt: faker.date.recent(),
                  deletedAt: faker.date.recent(),
                  sentAuthorMessage: {
                    id: faker.datatype.uuid(),
                    name: faker.name.firstName(),
                    surname: faker.name.lastName(),
                    avatarImg: faker.image.imageUrl(),
                  },
                },
              ],
            },
          },
        ],
        notice: {
          description: 'Create chat group',
        },
      }),
    },
  },
};

const addUserToChatGroupSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.ADD_USER_TO_CHAT_GROUP_EVENT,
  }).example({
    event: SOCKET_EVENTS.ADD_USER_TO_CHAT_GROUP_EVENT,
  }),
  body: Joi.object({
    newUserIds: Joi.array().items(Joi.string().uuid()),
    roomId: Joi.string().uuid(),
  }).example({
    newUserIds: [faker.datatype.uuid()],
    roomId: faker.datatype.uuid(),
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.ADD_USER_TO_CHAT_GROUP_EVENT,
        response: [
          {
            message: 'Group member added successfully',
            newMessages: {
              id: faker.datatype.uuid(),
              name: faker.lorem.word(),
              avatarImg: faker.image.imageUrl(),
              roomMessages: [
                {
                  id: faker.datatype.uuid(),
                  authorId: faker.datatype.uuid(),
                  roomId: faker.datatype.uuid(),
                  text: faker.lorem.sentence(),
                  isNew: faker.datatype.boolean(),
                  isEdit: faker.datatype.boolean(),
                  createdAt: faker.date.recent(),
                  updatedAt: faker.date.recent(),
                  deletedAt: faker.date.recent(),
                  sentAuthorMessage: {
                    id: faker.datatype.uuid(),
                    name: faker.name.firstName(),
                    surname: faker.name.lastName(),
                    avatarImg: faker.image.imageUrl(),
                  },
                },
              ],
            },
          },
        ],
        notice: {
          description: 'Add user to chat group',
        },
      }),
    },
  },
};

const removeUserFromChatGroupSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.REMOVE_USER_FROM_CHAT_GROUP_EVENT,
  }).example({
    event: SOCKET_EVENTS.REMOVE_USER_FROM_CHAT_GROUP_EVENT,
  }),
  body: Joi.object({
    roomId: Joi.string().uuid(),
    userId: Joi.string().uuid(),
  }).example({
    roomId: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.REMOVE_USER_FROM_CHAT_GROUP_EVENT,
        response: [
          {
            message: 'Group member removed successfully',
            newMessages: {
              id: faker.datatype.uuid(),
              name: faker.lorem.word(),
              avatarImg: faker.image.imageUrl(),
              roomMessages: [
                {
                  id: faker.datatype.uuid(),
                  authorId: faker.datatype.uuid(),
                  roomId: faker.datatype.uuid(),
                  text: faker.lorem.sentence(),
                  isNew: faker.datatype.boolean(),
                  isEdit: faker.datatype.boolean(),
                  createdAt: faker.date.recent(),
                  updatedAt: faker.date.recent(),
                  deletedAt: faker.date.recent(),
                  sentAuthorMessage: {
                    id: faker.datatype.uuid(),
                    name: faker.name.firstName(),
                    surname: faker.name.lastName(),
                    avatarImg: faker.image.imageUrl(),
                  },
                },
              ],
            },
          },
        ],
        notice: {
          description: 'Remove user from chat group',
        },
      }),
    },
  },
};

const removeChatGroupSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.REMOVE_CHAT_GROUP_EVENT,
  }).example({
    event: SOCKET_EVENTS.REMOVE_CHAT_GROUP_EVENT,
  }),
  body: Joi.object({
    roomId: Joi.string().uuid(),
  }).example({
    roomId: faker.datatype.uuid(),
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.REMOVE_CHAT_GROUP_EVENT,
        response: [
          {
            message: 'Chat group removed successfully',
          },
        ],
        notice: {
          description: 'Remove chat group',
        },
      }),
    },
  },
};

const editChatGroupNameSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.EDIT_CHAT_GROUP_NAME_EVENT,
  }).example({
    event: SOCKET_EVENTS.EDIT_CHAT_GROUP_NAME_EVENT,
  }),
  body: Joi.object({
    newName: Joi.string(),
    roomId: Joi.string().uuid(),
  }).example({
    newName: faker.lorem.word(),
    roomId: faker.datatype.uuid(),
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.EDIT_CHAT_GROUP_NAME_EVENT,
        response: [
          {
            message: 'Chat group name edited successfully',
            roomId: faker.datatype.uuid(),
            newName: faker.lorem.word(),
          },
        ],
        notice: {
          description: 'Edit chat group name',
        },
      }),
    },
  },
};

const uploadChatGroupAvatarSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.UPLOAD_CHAT_GROUP_AVATAR_EVENT,
  }).example({
    event: SOCKET_EVENTS.UPLOAD_CHAT_GROUP_AVATAR_EVENT,
  }),
  body: Joi.object({
    groupImg: Joi.object(),
    roomId: Joi.string().uuid(),
  }).example({
    groupImg: {
      fieldname: 'file',
      originalname: 'original Name of file',
      encoding: '7bit',
      mimetype: 'image/png',
      buffer: '<Buffer 89 56 ff ...>',
      size: '2097152',
    },
    groupId: faker.datatype.uuid(),
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.UPLOAD_CHAT_GROUP_AVATAR_EVENT,
        response: [
          {
            message: 'Chat group img edited successfully',
            roomId: faker.datatype.uuid(),
            newGroupImg: faker.image.imageUrl(),
          },
        ],
        notice: {
          description: 'Upload chat group avatar',
        },
      }),
    },
  },
};

const leaveFromChatGroupSchema: EndpointSchema = {
  params: Joi.object({
    event: SOCKET_EVENTS.LEAVE_FROM_CHAT_GROUP_EVENT,
  }).example({
    event: SOCKET_EVENTS.LEAVE_FROM_CHAT_GROUP_EVENT,
  }),
  body: Joi.object({
    userId: Joi.string().uuid(),
    roomId: Joi.string().uuid(),
  }).example({
    userId: faker.datatype.uuid(),
    roomId: faker.datatype.uuid(),
  }),
  response: {
    200: {
      schema: Joi.object({
        broadcastEvent: Joi.string(),
        notice: Joi.object({
          description: Joi.string(),
        }),
      }).example({
        event: SOCKET_EVENTS.LEAVE_FROM_CHAT_GROUP_EVENT,
        response: [
          {
            message: 'Group member removed successfully',
            roomId: faker.datatype.uuid(),
            userId: faker.datatype.uuid(),
            newMessages: {
              id: faker.datatype.uuid(),
              name: faker.lorem.word(),
              avatarImg: faker.image.imageUrl(),
              roomMessages: [
                {
                  id: faker.datatype.uuid(),
                  authorId: faker.datatype.uuid(),
                  roomId: faker.datatype.uuid(),
                  text: faker.lorem.sentence(),
                  isNew: faker.datatype.boolean(),
                  isEdit: faker.datatype.boolean(),
                  createdAt: faker.date.recent(),
                  updatedAt: faker.date.recent(),
                  deletedAt: faker.date.recent(),
                  sentAuthorMessage: {
                    id: faker.datatype.uuid(),
                    name: faker.name.firstName(),
                    surname: faker.name.lastName(),
                    avatarImg: faker.image.imageUrl(),
                  },
                },
              ],
            },
          },
        ],
        notice: {
          description: 'Leave from chat group',
        },
      }),
    },
  },
};

export default {
  connection: connectionSchema,
  userJoinToChat: userJoinToChatSchema,
  userLeftFromChat: userLeftFromChatSchema,
  getChatMessages: getChatMessagesSchema,
  sendPrivateMessage: sendPrivateMessageSchema,
  deleteChatHistory: deleteChatHistorySchema,
  userTyping: userTypingSchema,
  userEndTyping: userEndTypingSchema,
  readMessage: readMessageSchema,
  getNewMessages: getNewMessagesSchema,
  editMessage: editMessageSchema,
  createChatGroup: createChatGroupSchema,
  addUserToChatGroup: addUserToChatGroupSchema,
  removeUserFromChatGroup: removeUserFromChatGroupSchema,
  removeChatGroup: removeChatGroupSchema,
  editChatGroupName: editChatGroupNameSchema,
  uploadChatGroupAvatar: uploadChatGroupAvatarSchema,
  leaveFromChatGroup: leaveFromChatGroupSchema,
};
