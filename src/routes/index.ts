import express from 'express';
import swaggerUI from 'swagger-ui-express';
import { SWAGGER_ROUTE, USERS_ROUTE } from '../constants';
import swDocument from '../../swagger.def';
import users from './users';
import { globalErrorHandler } from '../middlewares';

export default (app: express.Application) => {
  app.use(SWAGGER_ROUTE, swaggerUI.serve, swaggerUI.setup(swDocument));
  app.use(USERS_ROUTE, users);
  app.use(globalErrorHandler);
};
