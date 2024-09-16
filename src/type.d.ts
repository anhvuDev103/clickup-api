// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';

import User from './models/schemas/User.shema';
import { TokenPayload } from './utils/jwt';

declare module 'express' {
  interface Request {
    user?: User;
    decoded_authorization?: TokenPayload;
  }
}
