import Joi from 'joi';
import j2s from 'joi-to-swagger';
import {
  EndpointSchema,
  EndpointSchemaSwaggerOptions,
  ResponseEndpointSchema,
} from '../interfaces';

export const swaggerBuilder = {
  body(schema: EndpointSchema) {
    if (!Joi.isSchema(schema.body)) throw new Error('Not a joi schema');
    return getBodySchema(schema.body);
  },

  path(schema: EndpointSchema) {
    if (!Joi.isSchema(schema.params)) throw new Error('Not a joi schema');
    return paramsSchema(schema.params, 'path');
  },

  query(schema: EndpointSchema) {
    if (!Joi.isSchema(schema.query)) throw new Error('Not a joi schema');
    return paramsSchema(schema.query, 'query');
  },

  response(schema: EndpointSchema) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {};

    Object.keys(schema.response).forEach((status: string) => {
      result[status] = {
        ...getBodySchema(schema.response[status].schema),
        ...schema.response[status].swaggerOptions,
      };
    });

    return result;
  },

  errorResponse(
    schema: Joi.Schema,
    swaggerOptions?: EndpointSchemaSwaggerOptions,
  ): ResponseEndpointSchema {
    return {
      schema: schema,
      swaggerOptions,
    };
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const paramsSchema = (schema: Joi.Schema<any>, method: string) => {
  const swaggerSchema = j2s(schema).swagger;
  const swaggerUi = Object.keys(swaggerSchema.properties).map((key) => {
    let required = false;
    if (swaggerSchema?.required) {
      required = swaggerSchema?.required.includes(key);
    }
    return {
      in: method,
      name: key,
      schema: swaggerSchema.properties[key],
      required,
    };
  });
  return swaggerUi;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBodySchema = (schema: Joi.Schema<any>) => {
  const swaggerSchema = j2s(schema).swagger;

  return {
    content: {
      'application/json': {
        schema: swaggerSchema,
      },
    },
  };
};
