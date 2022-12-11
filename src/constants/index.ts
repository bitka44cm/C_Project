import { CookieOptions } from 'express';
import { JWT_TIMESTAMPS } from '../services/tokenService';

// Routes
export const API_ROUTE = '/api';

export const SWAGGER_ROUTE = `${API_ROUTE}/api-docs`;

// Users routes
export const USERS_ROUTE = `${API_ROUTE}/users`;

export const GET_USERS_ROUTE = `/`;
export const GET_USER_ROUTE = `/:id`;
export const REGISTRATION_ROUTE = '/registration';
export const LOGIN_ROUTE = '/login';
export const LOGOUT_ROUTE = '/logout';
export const REFRESH_ROUTE = '/refresh';
export const REJECT_STATUS_ROUTE = '/reject-status/:id';
export const CONFIRM_STATUS_ROUTE = '/confirm-status/:id';
export const GET_CONFIRMED_AND_REJECTED_USERS_ROUTE = '/confirmed-rejected-users';
export const GET_PENDING_USERS_ROUTE = '/pending-users';
export const CREATE_NEW_USER_ROUTE = '/create-new-user';
export const DELETE_USER_ROUTE = '/delete-user/:id';
export const EDIT_USER_ROUTE = '/patch-user-info';
export const GET_FILTERED_USERS_ROUTE = '/filtered-users';
export const UPLOAD_USER_AVATAR_ROUTE = '/upload-user-avatar';
export const RESET_PASSWORD_ROUTE = '/reset-password';
export const FORGOT_PASSWORD_ROUTE = '/forgot-password';
export const GET_MANAGER_EMPLOYEES_ROUTE = '/manager-employees/:id';
export const ADD_EMPLOYEE_TO_MANAGER_TEAM_ROUTE = '/add-employee-to-manager';
export const REMOVE_EMPLOYEE_FROM_MANAGER_TEAM_ROUTE = '/remove-employee-from-manager';

export enum HTTP_CODE {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export enum RESPONSE_CODE {
  VALIDATION_ERROR = 'validation_error',
  FORBIDDEN_ERROR = 'forbidden_error',
  NOT_FOUND_ERROR = 'not_found_error',
}

export enum ROLES {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  EMPLOYEE = 'Employee',
}

export enum STATUS {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  REJECTED = 'Rejected',
}

export const DEFAULT_LIMIT = 100;
export const DEFAULT_OFFSET = 0;

export const COOKIE_OPTIONS: CookieOptions = {
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV !== 'development',
  httpOnly: true,
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  maxAge: JWT_TIMESTAMPS.refreshTokenExpiresInSec * 1000, // cast to ms
};

export enum SOCKET_EVENTS {
  JOIN_TO_CHAT_EVENT = 'joinToChat',
  LEFT_FROM_CHAT_EVENT = 'leftFromChat',
  ERROR_EVENT = 'error',
  GET_CHAT_MESSAGES_EVENT = 'getChatMessages',
  SEND_PRIVATE_MESSAGE_EVENT = 'sendPrivateMessage',
  DELETE_CHAT_HISTORY_EVENT = 'deleteChatHistory',
  USER_IS_TYPING_EVENT = 'userIsTyping',
  USER_END_TYPING_EVENT = 'userEndTyping',
  READ_MESSAGE_EVENT = 'readMessage',
  GET_NEW_MESSAGES_EVENT = 'getNewMessages',
  EDIT_MESSAGE_EVENT = 'editMessage',
  CREATE_CHAT_GROUP_EVENT = 'createChatGroup',
  ADD_USER_TO_CHAT_GROUP_EVENT = 'addUserToChatGroup',
  REMOVE_USER_FROM_CHAT_GROUP_EVENT = 'removeUserFromChatGroup',
  REMOVE_CHAT_GROUP_EVENT = 'removeChatGroup',
  EDIT_CHAT_GROUP_NAME_EVENT = 'editChatGroupName',
  UPLOAD_CHAT_GROUP_AVATAR_EVENT = 'uploadChatGroupAvatar',
  LEAVE_FROM_CHAT_GROUP_EVENT = 'leaveFromChatGroup',
}
