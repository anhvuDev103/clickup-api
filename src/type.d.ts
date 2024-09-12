// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';

import User from './models/schemas/User.shema';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
