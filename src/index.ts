import 'dotenv/config';

import cors from 'cors';
import express from 'express';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
