import {
  USERS_ROUTE,
  GET_USERS_ROUTE,
  REGISTRATION_ROUTE,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  GET_CONFIRMED_AND_REJECTED_USERS_ROUTE,
  GET_PENDING_USERS_ROUTE,
  REJECT_STATUS_ROUTE,
  CONFIRM_STATUS_ROUTE,
  REFRESH_ROUTE,
  CREATE_NEW_USER_ROUTE,
  DELETE_USER_ROUTE,
  GET_USER_ROUTE,
  EDIT_USER_ROUTE,
  GET_FILTERED_USERS_ROUTE,
  UPLOAD_USER_AVATAR_ROUTE,
  RESET_PASSWORD_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  GET_MANAGER_EMPLOYEES_ROUTE,
  ADD_EMPLOYEE_TO_MANAGER_TEAM_ROUTE,
  REMOVE_EMPLOYEE_FROM_MANAGER_TEAM_ROUTE,
} from '../../constants';
import { swaggerBuilder } from '../../utils/swaggerBuilder';
import { HttpMethods, swaggerObjectBuilder } from '../../utils/swaggerObjectBuilder';
import schemas from './schema';

const getUsers = {
  method: HttpMethods.GET,
  path: GET_USERS_ROUTE,
  summary: 'Get users',
  tags: ['users'],
  parameters: swaggerBuilder.query(schemas.getUsers),
  responses: swaggerBuilder.response(schemas.getUsers),
};

const registration = {
  method: HttpMethods.POST,
  path: REGISTRATION_ROUTE,
  summary: 'Register user',
  tags: ['users'],
  requestBody: swaggerBuilder.body(schemas.registration),
  responses: swaggerBuilder.response(schemas.registration),
};

const login = {
  method: HttpMethods.POST,
  path: LOGIN_ROUTE,
  summary: 'Login',
  tags: ['users'],
  requestBody: swaggerBuilder.body(schemas.login),
  responses: swaggerBuilder.response(schemas.login),
};

const logout = {
  method: HttpMethods.GET,
  path: LOGOUT_ROUTE,
  summary: 'Logout user',
  tags: ['users'],
  responses: swaggerBuilder.response(schemas.logout),
};

const getConfirmedAndRejectedUsers = {
  method: HttpMethods.GET,
  path: GET_CONFIRMED_AND_REJECTED_USERS_ROUTE,
  summary: 'Get confirmed and rejected users',
  tags: ['users'],
  parameters: swaggerBuilder.query(schemas.getConfirmedAndRejectedUsers),
  responses: swaggerBuilder.response(schemas.getConfirmedAndRejectedUsers),
};

const getPendingUsers = {
  method: HttpMethods.GET,
  path: GET_PENDING_USERS_ROUTE,
  summary: 'Get pending users',
  tags: ['users'],
  parameters: swaggerBuilder.query(schemas.getPendingUsers),
  responses: swaggerBuilder.response(schemas.getPendingUsers),
};

const rejectUserStatus = {
  method: HttpMethods.PATCH,
  path: REJECT_STATUS_ROUTE,
  summary: 'Reject user status',
  tags: ['users'],
  parameters: swaggerBuilder.path(schemas.rejectUserStatus),
  responses: swaggerBuilder.response(schemas.rejectUserStatus),
};

const confirmUserStatus = {
  method: HttpMethods.PATCH,
  path: CONFIRM_STATUS_ROUTE,
  summary: 'Confirm user status',
  tags: ['users'],
  parameters: swaggerBuilder.path(schemas.confirmUserStatus),
  responses: swaggerBuilder.response(schemas.confirmUserStatus),
};

const refresh = {
  method: HttpMethods.GET,
  path: REFRESH_ROUTE,
  summary: 'Refresh access token',
  tags: ['users'],
  responses: swaggerBuilder.response(schemas.refresh),
};

const createNewUser = {
  method: HttpMethods.POST,
  path: CREATE_NEW_USER_ROUTE,
  summary: 'Create new user',
  tags: ['users'],
  requestBody: swaggerBuilder.body(schemas.createNewUser),
  responses: swaggerBuilder.response(schemas.createNewUser),
};

const deleteUser = {
  method: HttpMethods.DELETE,
  path: DELETE_USER_ROUTE,
  summary: 'Delete user',
  tags: ['users'],
  parameters: swaggerBuilder.path(schemas.deleteUser),
  responses: swaggerBuilder.response(schemas.deleteUser),
};

const getUser = {
  method: HttpMethods.GET,
  path: GET_USER_ROUTE,
  summary: 'Get user',
  tags: ['users'],
  parameters: swaggerBuilder.path(schemas.getUser),
  responses: swaggerBuilder.response(schemas.getUser),
};

const editUser = {
  method: HttpMethods.PATCH,
  path: EDIT_USER_ROUTE,
  summary: 'Edit user',
  tags: ['users'],
  requestBody: swaggerBuilder.body(schemas.editUser),
  responses: swaggerBuilder.response(schemas.editUser),
};

const getFilteredUsers = {
  method: HttpMethods.GET,
  path: GET_FILTERED_USERS_ROUTE,
  summary: 'Get filtered users',
  tags: ['users'],
  parameters: swaggerBuilder.query(schemas.getFilteredUsers),
  responses: swaggerBuilder.response(schemas.getFilteredUsers),
};

const uploadUserAvatar = {
  method: HttpMethods.POST,
  path: UPLOAD_USER_AVATAR_ROUTE,
  summary: 'Upload user avatar',
  tags: ['users'],
  requestBody: swaggerBuilder.body(schemas.uploadUserAvatar),
  responses: swaggerBuilder.response(schemas.uploadUserAvatar),
};

const resetPassword = {
  method: HttpMethods.PUT,
  path: RESET_PASSWORD_ROUTE,
  summary: 'Reset Password by email',
  tags: ['users'],
  requestBody: swaggerBuilder.body(schemas.resetPassword),
  responses: swaggerBuilder.response(schemas.resetPassword),
};

const forgotPassword = {
  method: HttpMethods.POST,
  path: FORGOT_PASSWORD_ROUTE,
  summary: 'Forgot password',
  tags: ['users'],
  requestBody: swaggerBuilder.body(schemas.forgotPassword),
  responses: swaggerBuilder.response(schemas.forgotPassword),
};

const getManagerEmployees = {
  method: HttpMethods.GET,
  path: GET_MANAGER_EMPLOYEES_ROUTE,
  summary: 'Get manager employees',
  tags: ['users'],
  parameters: swaggerBuilder.path(schemas.getManagerEmployees),
  responses: swaggerBuilder.response(schemas.getManagerEmployees),
};

const addEmployeeToManagerTeam = {
  method: HttpMethods.POST,
  path: ADD_EMPLOYEE_TO_MANAGER_TEAM_ROUTE,
  summary: 'Add employee to manager team',
  tags: ['users'],
  requestBody: swaggerBuilder.body(schemas.addEmployeeToManagerTeam),
  responses: swaggerBuilder.response(schemas.addEmployeeToManagerTeam),
};

const removeEmployeeFromManagerTeam = {
  method: HttpMethods.DELETE,
  path: REMOVE_EMPLOYEE_FROM_MANAGER_TEAM_ROUTE,
  summary: 'Remove employee from manager team',
  tags: ['users'],
  requestBody: swaggerBuilder.body(schemas.removeEmployeeFromManagerTeam),
  responses: swaggerBuilder.response(schemas.removeEmployeeFromManagerTeam),
};

export default swaggerObjectBuilder(
  USERS_ROUTE,
  getUsers,
  registration,
  login,
  logout,
  getConfirmedAndRejectedUsers,
  getPendingUsers,
  rejectUserStatus,
  confirmUserStatus,
  refresh,
  createNewUser,
  deleteUser,
  getUser,
  editUser,
  getFilteredUsers,
  uploadUserAvatar,
  resetPassword,
  forgotPassword,
  getManagerEmployees,
  addEmployeeToManagerTeam,
  removeEmployeeFromManagerTeam,
);
