import express from 'express';
import { authMiddleware, hasAdminRole, schemaValidator, uploadImg } from '../../middlewares';
import {
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
import controller from './controller';
import schema from './schema';

const router = express.Router();

router.get(
  GET_FILTERED_USERS_ROUTE,
  authMiddleware,
  schemaValidator(schema.getFilteredUsers),
  controller.getFilteredUsers,
);

router.get(GET_USERS_ROUTE, authMiddleware, schemaValidator(schema.getUsers), controller.getUsers);

router.post(REGISTRATION_ROUTE, schemaValidator(schema.registration), controller.registration);

router.post(LOGIN_ROUTE, schemaValidator(schema.login), controller.login);

router.patch(
  EDIT_USER_ROUTE,
  authMiddleware,
  schemaValidator(schema.editUser),
  controller.editUser,
);

router.get(LOGOUT_ROUTE, controller.logout);

router.get(
  GET_CONFIRMED_AND_REJECTED_USERS_ROUTE,
  authMiddleware,
  hasAdminRole,
  schemaValidator(schema.getConfirmedAndRejectedUsers),
  controller.getConfirmedAndRejectedUsers,
);

router.get(
  GET_PENDING_USERS_ROUTE,
  authMiddleware,
  hasAdminRole,
  schemaValidator(schema.getPendingUsers),
  controller.getPendingUsers,
);

router.patch(
  REJECT_STATUS_ROUTE,
  authMiddleware,
  hasAdminRole,
  schemaValidator(schema.rejectUserStatus),
  controller.rejectUserStatus,
);

router.patch(
  CONFIRM_STATUS_ROUTE,
  authMiddleware,
  hasAdminRole,
  schemaValidator(schema.confirmUserStatus),
  controller.confirmUserStatus,
);

router.get(REFRESH_ROUTE, schemaValidator(schema.refresh), controller.refresh);

router.post(
  CREATE_NEW_USER_ROUTE,
  authMiddleware,
  hasAdminRole,
  schemaValidator(schema.createNewUser),
  controller.createNewUser,
);

router.delete(
  DELETE_USER_ROUTE,
  authMiddleware,
  hasAdminRole,
  schemaValidator(schema.deleteUser),
  controller.deleteUser,
);

router.get(GET_USER_ROUTE, authMiddleware, schemaValidator(schema.getUser), controller.getUser);

router.post(
  UPLOAD_USER_AVATAR_ROUTE,
  authMiddleware,
  uploadImg.single('image'),
  schemaValidator(schema.uploadUserAvatar),
  controller.uploadUserAvatar,
);

router.put(RESET_PASSWORD_ROUTE, schemaValidator(schema.resetPassword), controller.resetPassword);

router.post(
  FORGOT_PASSWORD_ROUTE,
  schemaValidator(schema.forgotPassword),
  controller.forgotPassword,
);

router.get(
  GET_MANAGER_EMPLOYEES_ROUTE,
  authMiddleware,
  schemaValidator(schema.getManagerEmployees),
  controller.getManagerEmployees,
);

router.post(
  ADD_EMPLOYEE_TO_MANAGER_TEAM_ROUTE,
  authMiddleware,
  schemaValidator(schema.addEmployeeToManagerTeam),
  controller.addEmployeeToManagerTeam,
);

router.delete(
  REMOVE_EMPLOYEE_FROM_MANAGER_TEAM_ROUTE,
  authMiddleware,
  schemaValidator(schema.removeEmployeeFromManagerTeam),
  controller.removeEmployeeFromManagerTeam,
);

export default router;
