import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import userRouter from './routes/user.routes';
import databaseService from './services/database.services';
import { defaultErrorRequestHandler } from './utils/error-handler';

const app = express();
const port = process.env.PORT;

databaseService.connect().catch(console.dir);

app.use(express.json());
app.use(cors());

app.use('/users', userRouter);

app.use(defaultErrorRequestHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
