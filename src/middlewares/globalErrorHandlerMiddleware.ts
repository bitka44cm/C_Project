import { NextFunction, Request, Response } from 'express';
import { BaseError, createError } from '../utils/errors';

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BaseError) {
    return sendError(res, err);
  }

  const serverError = new createError.InternalServerError({ ...err });
  console.error(JSON.stringify(serverError.toJSON()));
  return sendError(res, serverError);
};

const sendError = (res: Response, err: BaseError) => {
  const json = err.toJSON();
  return res.status(json.status).json(json.response);
};
