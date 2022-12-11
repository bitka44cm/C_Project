import { HTTP_CODE } from './../constants/index';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { createError } from '../utils/errors';
import { UserData } from '../routes/users/service';
import { RolesAttributes } from '../db/entities/rolesEntity';
import { RESPONSE_CODE, ROLES } from '../constants';

const secret = process.env.JWT_ACCESS_SECRET_TOKEN as string;

interface UserInfo extends UserData {
  roles?: Array<RolesAttributes>;
}

export const hasAdminRole = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || '';

  const accessToken = authHeader?.split(' ')[1];

  const userInfo = jwt.verify(accessToken, secret) as UserInfo;

  const isAdmin = userInfo.roles?.some((role) => role.name === ROLES.ADMIN);

  if (isAdmin) {
    next();
  } else {
    const error = new createError.ForbiddenError({ code: RESPONSE_CODE.FORBIDDEN_ERROR });
    res.status(HTTP_CODE.FORBIDDEN).json(error.toJSON().response);
  }
};
