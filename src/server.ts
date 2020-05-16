import express, { json } from 'express';
import 'reflect-metadata';
import uploadConfig from './config/upload';

import routes from './routes';

import './database';

const app = express();

app.use(json());

app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333');
});
