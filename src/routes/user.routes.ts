import express from 'express';

import { signInController } from '@/controllers/user.controllers';
import { signInValidator } from '@/middlewares/user.middlewares';

const userRouter = express.Router();

userRouter.post('/sign-in', signInValidator, signInController);

export default userRouter;
