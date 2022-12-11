import { swaggerBuilder } from '../../utils/swaggerBuilder';
import { HttpMethods, swaggerObjectBuilder } from '../../utils/swaggerObjectBuilder';
import schemas from './schema';

const connection = {
  method: HttpMethods.POST,
  path: '',
  summary: 'connection',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.connection),
  responses: swaggerBuilder.response(schemas.connection),
};

const userJoinToChat = {
  method: HttpMethods.POST,
  path: '/joinToChat',
  summary: 'joinToChat',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.userJoinToChat),
  responses: swaggerBuilder.response(schemas.userJoinToChat),
};

const userLeftFromChat = {
  method: HttpMethods.POST,
  path: '/leftFromChat',
  summary: 'leftFromChat',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.userLeftFromChat),
  responses: swaggerBuilder.response(schemas.userLeftFromChat),
};

const getChatMessages = {
  method: HttpMethods.POST,
  path: '/getChatMessages',
  summary: 'getChatMessages',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.getChatMessages),
  requestBody: swaggerBuilder.body(schemas.getChatMessages),
  responses: swaggerBuilder.response(schemas.getChatMessages),
};

const sendPrivateMessage = {
  method: HttpMethods.POST,
  path: '/sendPrivateMessage',
  summary: 'sendPrivateMessage',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.sendPrivateMessage),
  requestBody: swaggerBuilder.body(schemas.sendPrivateMessage),
  responses: swaggerBuilder.response(schemas.sendPrivateMessage),
};

const deleteChatHistory = {
  method: HttpMethods.POST,
  path: '/deleteChatHistory',
  summary: 'deleteChatHistory',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.deleteChatHistory),
  requestBody: swaggerBuilder.body(schemas.deleteChatHistory),
  responses: swaggerBuilder.response(schemas.deleteChatHistory),
};

const userTyping = {
  method: HttpMethods.POST,
  path: '/userIsTyping',
  summary: 'userIsTyping',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.userTyping),
  requestBody: swaggerBuilder.body(schemas.userTyping),
  responses: swaggerBuilder.response(schemas.userTyping),
};

const userEndTyping = {
  method: HttpMethods.POST,
  path: '/userEndTyping',
  summary: 'userEndTyping',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.userEndTyping),
  requestBody: swaggerBuilder.body(schemas.userEndTyping),
  responses: swaggerBuilder.response(schemas.userEndTyping),
};

const readMessage = {
  method: HttpMethods.POST,
  path: '/readMessage',
  summary: 'readMessage',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.readMessage),
  requestBody: swaggerBuilder.body(schemas.readMessage),
  responses: swaggerBuilder.response(schemas.readMessage),
};

const getNewMessages = {
  method: HttpMethods.POST,
  path: '/getNewMessages',
  summary: 'getNewMessages',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.getNewMessages),
  requestBody: swaggerBuilder.body(schemas.getNewMessages),
  responses: swaggerBuilder.response(schemas.getNewMessages),
};

const editMessage = {
  method: HttpMethods.POST,
  path: '/editMessage',
  summary: 'editMessage',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.editMessage),
  requestBody: swaggerBuilder.body(schemas.editMessage),
  responses: swaggerBuilder.response(schemas.editMessage),
};

const createChatGroup = {
  method: HttpMethods.POST,
  path: '/createChatGroup',
  summary: 'createChatGroup',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.createChatGroup),
  requestBody: swaggerBuilder.body(schemas.createChatGroup),
  responses: swaggerBuilder.response(schemas.createChatGroup),
};

const addUserToChatGroup = {
  method: HttpMethods.POST,
  path: '/addUserToChatGroup',
  summary: 'addUserToChatGroup',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.addUserToChatGroup),
  requestBody: swaggerBuilder.body(schemas.addUserToChatGroup),
  responses: swaggerBuilder.response(schemas.addUserToChatGroup),
};

const removeUserFromChatGroup = {
  method: HttpMethods.POST,
  path: '/removeUserFromChatGroup',
  summary: 'removeUserFromChatGroup',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.removeUserFromChatGroup),
  requestBody: swaggerBuilder.body(schemas.removeUserFromChatGroup),
  responses: swaggerBuilder.response(schemas.removeUserFromChatGroup),
};

const removeChatGroup = {
  method: HttpMethods.POST,
  path: '/removeChatGroup',
  summary: 'removeChatGroup',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.removeChatGroup),
  requestBody: swaggerBuilder.body(schemas.removeChatGroup),
  responses: swaggerBuilder.response(schemas.removeChatGroup),
};

const editChatGroupName = {
  method: HttpMethods.POST,
  path: '/editChatGroupName',
  summary: 'editChatGroupName',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.editChatGroupName),
  requestBody: swaggerBuilder.body(schemas.editChatGroupName),
  responses: swaggerBuilder.response(schemas.editChatGroupName),
};

const uploadChatGroupAvatar = {
  method: HttpMethods.POST,
  path: '/uploadChatGroupAvatar',
  summary: 'uploadChatGroupAvatar',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.uploadChatGroupAvatar),
  requestBody: swaggerBuilder.body(schemas.uploadChatGroupAvatar),
  responses: swaggerBuilder.response(schemas.uploadChatGroupAvatar),
};

const leaveFromChatGroup = {
  method: HttpMethods.POST,
  path: '/leaveFromChatGroup',
  summary: 'leaveFromChatGroup',
  tags: ['SOCKET IO'],
  parameters: swaggerBuilder.path(schemas.leaveFromChatGroup),
  requestBody: swaggerBuilder.body(schemas.leaveFromChatGroup),
  responses: swaggerBuilder.response(schemas.leaveFromChatGroup),
};

export default swaggerObjectBuilder(
  '',
  connection,
  userJoinToChat,
  userLeftFromChat,
  getChatMessages,
  sendPrivateMessage,
  deleteChatHistory,
  userTyping,
  userEndTyping,
  readMessage,
  getNewMessages,
  editMessage,
  createChatGroup,
  addUserToChatGroup,
  removeUserFromChatGroup,
  removeChatGroup,
  editChatGroupName,
  uploadChatGroupAvatar,
  leaveFromChatGroup,
);
