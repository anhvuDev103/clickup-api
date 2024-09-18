import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import authRouter from './routes/auth.routes';
import hierarchyRouter from './routes/hierarchy.routes';
import usersRouter from './routes/user.routes';
import verificationRouter from './routes/verification.routes';
import workspacesRouter from './routes/workspaces.routes';
import databaseService from './services/database.services';
import { defaultErrorRequestHandler } from './utils/error-handler';
import { logger } from './utils/logger';

const app = express();
const port = process.env.PORT;

databaseService
  .connect()
  .then(() => {
    return databaseService.createIndexes();
  })
  .then(() => {
    logger.app('Start');
  })
  .catch(console.dir);

app.use(express.json());
app.use(cors());

app.use('/verification', verificationRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.use('/workspaces', workspacesRouter);
app.use('/hierarchy', hierarchyRouter);

app.use(defaultErrorRequestHandler);

app.listen(port, () => {
  logger.app(`Listening on port ${port}`);
});
