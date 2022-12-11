import 'express-async-errors';

import cors from 'cors';
import express, { Application } from 'express';
import cookies from 'cookie-parser';
import webSocketsServer from './webSockets';

const http = require('http');
/* import * as http from "http"; */

import initRoutes from './routes';

require('dotenv').config();

const app: Application = express();

let url = process.env.FRONTEND_URL;

if (process.env.NODE_ENV === 'production') {
  url = process.env.NETLIFY_URL;
}

// setup CORS
app.use(
  cors({
    credentials: true,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    origin: [url!],
    optionsSuccessStatus: 204,
  }),
);
// Setup static files
app.use('/uploads', express.static('uploads'));
app.use(express.static('mailTemplates'));

app.use(cookies());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

const server = http.createServer(app);

webSocketsServer(server);

export default server;
