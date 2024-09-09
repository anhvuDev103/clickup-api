import express from 'express';

import { signInController } from '@/controllers/user.controllers';
import { signInValidator } from '@/middlewares/user.middlewares';
import { wrapRequestHandler } from '@/utils/error-handler';

const userRouter = express.Router();

userRouter.post('/sign-in', signInValidator, wrapRequestHandler(signInController));

export default userRouter;
