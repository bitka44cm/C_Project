import { HTTP_CODE } from '../constants/index';
import express, { Response } from 'express';
import Joi from 'joi';
import { RESPONSE_CODE } from '../constants';
import { EndpointSchema } from '../interfaces';
import { BadDataError, createError } from '../utils/errors';

export const schemaValidator =
  (schema: EndpointSchema) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<unknown> => {
    if (schema.query) {
      const result = schema.query.validate(req.query);

      if (result.error) {
        const errors = result.error.details.map(mapJoiError);
        return sendBadData(res, errors);
      }
    }

    if (schema.body) {
      const result = schema.body.validate(req.body);

      if (result.error) {
        const errors = result.error.details.map(mapJoiError);
        return sendBadData(res, errors);
      }
    }

    return next();
  };

function mapJoiError(err: Joi.ValidationErrorItem): BadDataError {
  return {
    path: err.path,
    type: err.type,
    message: err.message,
  };
}

const sendBadData = (res: Response, errors: BadDataError[]) => {
  const errorsToSend = errors.map((e) => ({
    path: e.path,
    type: e.type,
    message: e.message,
  }));
  const error = new createError.UnprocessableEntity({
    data: { errors: errorsToSend },
    code: RESPONSE_CODE.VALIDATION_ERROR,
  });
  return res.status(HTTP_CODE.UNPROCESSABLE_ENTITY).json(error.toJSON().response);
};
