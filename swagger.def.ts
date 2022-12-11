import pkgJson from './package.json';
import usersSwagger from './src/routes/users/swagger';
import socketSwagger from './src/webSockets/chatWebsocket/swagger';

const DEFAULT_PORT = 8000;

const port = process.env.PORT || DEFAULT_PORT;
const server =
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
    ? {
        url: `http://localhost:${port}`,
        description: 'development server',
      }
    : {
        url: process.env.SERVER_ENDPOINT,
        description: `${process.env.NODE_ENV} server`,
      };

const swagger = {
  openapi: '3.0.0',
  info: {
    title: 'Sunmait Career Day API',
    version: `${pkgJson.version}`,
    description: 'The REST API',
  },
  servers: [server],
  showExplorer: true,
  components: {
    securitySchemes: {
      Cookie: {
        type: 'apiKey',
        name: 'refreshCookie',
        in: 'header',
      },
      UserIdKey: {
        type: 'apiKey',
        in: 'header',
        name: 'userId',
      },
      AuthorizationKey: {
        type: 'apiKey',
        in: 'header',
        name: 'authorization',
      },
    },
  },
  security: [{ Cookie: [] }, { AuthorizationKey: [] }, { UserIdKey: [] }],

  paths: {
    ...usersSwagger,
    ...socketSwagger,
  },
};
export default swagger;
