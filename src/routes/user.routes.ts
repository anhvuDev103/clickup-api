import express from 'express';

import { signInController, signUpController } from '@/controllers/user.controllers';
import { signInValidator, signUpValidator } from '@/middlewares/user.middlewares';
import { wrapRequestHandler } from '@/utils/error-handler';

const userRouter = express.Router();

/**
 * POST /users/sign-up
 *
 * Request body:
 * {
 *    name: string
 *    email: string
 *    password: string
 * }
 *
 * Response:
 * - 201 Created: On success.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 409 Conflict: When the email already exists.
 */
userRouter.post('/sign-up', signUpValidator, wrapRequestHandler(signUpController));

userRouter.post('/sign-in', signInValidator, wrapRequestHandler(signInController));

export default userRouter;
