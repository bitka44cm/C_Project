import Joi from 'joi';

export interface ArrayResponse<T> {
  results: T;
  metadata: {
    count: number;
    limit: number;
    offset: number;
  };
}

export interface EndpointSchema {
  params?: Joi.Schema;

  body?: Joi.Schema;

  query?: Joi.Schema;

  response: {
    [status: string]: ResponseEndpointSchema;
  };
}

export interface ResponseEndpointSchema {
  schema: Joi.Schema;
  swaggerOptions?: EndpointSchemaSwaggerOptions;
}

export interface EndpointSchemaSwaggerOptions {
  description?: string;
}

export namespace ResponseLocals {
  export interface AuthenticatedUser {
    userId: number;
  }
}

export interface Pagination {
  limit: number;
  offset: number;
}

export interface DialectOptions {
  ssl: {
    require: boolean;
    rejectUnauthorized: boolean;
  };
}

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
}
