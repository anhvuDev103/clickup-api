import express from 'express';

import { signInController, signUpController } from '@/controllers/user.controllers';
import { signInValidator, signUpValidator } from '@/middlewares/user.middlewares';
import { wrapRequestHandler } from '@/utils/error-handler';

const userRouter = express.Router();

userRouter.post('/sign-up', signUpValidator, wrapRequestHandler(signUpController));

userRouter.post('/sign-in', signInValidator, wrapRequestHandler(signInController));

export default userRouter;
