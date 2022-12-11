import Joi from 'joi';
import { createError } from './errors';
import { swaggerBuilder } from './swaggerBuilder';

export const buildResponse = (example: object | object[]) => {
  return swaggerBuilder.errorResponse(Joi.any().example(example));
};

export const schemaErrorExample = {
  noContent() {
    return new createError.NoContent().toJSON().response;
  },
  notFound() {
    return new createError.NotFound().toJSON().response;
  },
  forbiddenError(code: string) {
    return new createError.ForbiddenError({ code }).toJSON().response;
  },
  unauthenticatedError() {
    return new createError.Unauthenticated().toJSON().response;
  },
  unprocessableEntity(code: string, data?: object) {
    return new createError.UnprocessableEntity({ code, data }).toJSON().response;
  },

  internalServerError() {
    return new createError.InternalServerError().toJSON().response;
  },
};
