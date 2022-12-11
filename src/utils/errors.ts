import { HTTP_CODE } from './../constants/index';

export class BaseError extends Error {
  constructor(options: BaseErrorOptions) {
    super(options.msg);
    this.status = options.status;
    this.code = options.code;
    this.data = options.data;
  }
  private status: number;
  private code?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private data?: any;
  public stack?: string;

  toJSON() {
    const response: {
      code?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [p: string]: any; // response may be any
    } = {
      msg: this.message,
    };

    if (this.data) Object.assign(response, this.data);
    if (this.code) response.code = this.code;

    return {
      status: this.status,
      response,
    };
  }
}

class ForbiddenError extends BaseError {
  constructor(options: { code?: string } = {}) {
    super({ ...options, msg: 'Forbidden', status: HTTP_CODE.FORBIDDEN });
  }
}

class UnauthenticatedError extends BaseError {
  constructor() {
    super({ msg: 'Unauthenticated', status: HTTP_CODE.UNAUTHORIZED });
  }
}
class NotFoundError extends BaseError {
  constructor(options: { code?: string; data?: object } = {}) {
    super({ ...options, msg: 'Not Found', status: HTTP_CODE.NOT_FOUND });
  }
}

class NoContent extends BaseError {
  constructor() {
    super({ msg: 'No content found', status: HTTP_CODE.NO_CONTENT });
  }
}

class UnprocessableEntityError extends BaseError {
  constructor(options: { code?: string; data?: object } = {}) {
    super({ ...options, msg: 'Unprocessable Entity', status: HTTP_CODE.UNPROCESSABLE_ENTITY });
  }
}

class InternalServerError extends BaseError {
  constructor(options: { stack?: string } = {}) {
    super({ ...options, msg: 'Internal Server Error', status: HTTP_CODE.INTERNAL_SERVER_ERROR });
  }
}

class ConflictError extends BaseError {
  constructor(options: { stack?: string } = {}) {
    super({ ...options, msg: 'Conflict Error', status: HTTP_CODE.CONFLICT });
  }
}

export const createError = {
  Unauthenticated: UnauthenticatedError,
  NoContent: NoContent,
  NotFound: NotFoundError,
  UnprocessableEntity: UnprocessableEntityError,
  InternalServerError: InternalServerError,
  ForbiddenError: ForbiddenError,
  ConflictError: ConflictError,
};

export interface BadDataError {
  // number is added to satisfy joi's typings, in
  // most cases string is used
  path: (string | number)[];
  message: string;
  type: string;
}

interface BaseErrorOptions {
  msg: string;
  status: number;
  code?: string;
  stack?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any; // additional error data
}
