import { tokenService } from './../services/tokenService';
import express from 'express';
import { createError } from '../utils/errors';

export const authMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  let isAuthenticated = true;

  const authHeader = req.headers.authorization || '';
  if (!authHeader) {
    isAuthenticated = false;
  }
  const accessToken = authHeader?.split(' ')[1];

  if (!accessToken) {
    isAuthenticated = false;
  }
  const userData = tokenService.validateAccessToken(accessToken);
  if (!userData) {
    isAuthenticated = false;
  }
  if (isAuthenticated) {
    next();
  } else {
    throw new createError.Unauthenticated();
  }
};
