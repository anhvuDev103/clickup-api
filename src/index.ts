import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import databaseService from './services/database.services';

const app = express();
const port = process.env.PORT;

databaseService.connect().catch(console.dir);

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
