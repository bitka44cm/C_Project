interface SwaggerBuilderProps {
  path: string;
  method: string;
  summary: string;
  tags: string[];
  requestBody?: unknown;
  responses?: unknown;
  parameters?: unknown;
}
interface SchemaPropObject {
  [key: string]: Omit<SwaggerBuilderProps, 'path' | 'method'>;
}
interface SwaggerObject {
  [key: string]: SchemaPropObject;
}

export enum HttpMethods {
  GET = 'get',
  POST = 'post',
  PATCH = 'patch',
  DELETE = 'delete',
  HEAD = 'head',
  PUT = 'put',
  OPTIONS = 'options',
}

export function swaggerObjectBuilder(mainPath: string, ...args: SwaggerBuilderProps[]) {
  return args.reduce((acc, curr) => {
    const { method, path, ...a } = curr;
    const newPath = path === mainPath ? mainPath : mainPath + path;
    (acc as SwaggerObject)[newPath] = { ...(acc as SwaggerObject)[newPath], ...{ [method]: a } };
    return acc;
  }, {});
}
