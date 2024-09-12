import express from 'express';

import { signInController, signUpController } from '@/controllers/auth.controllers';
import { signInValidator, signUpValidator } from '@/middlewares/auth.middlewares';
import { wrapRequestHandler } from '@/utils/error-handler';

const authRouter = express.Router();

/**
 * POST /auth/sign-up
 *
 * Request body:
 * {
 *    name: string
 *    email: string
 *    password: string
 * }
 *
 * Response:
 * - 201 Created: On successful sign-up.
 * - 422 Unprocessable Entity: When input data is invalid.
 */
authRouter.post('/sign-up', signUpValidator, wrapRequestHandler(signUpController));

/**
 * POST /auth/sign-in
 *
 * Request body:
 * {
 *    email: string
 *    password: string
 * }
 *
 * Response:
 * - 200 OK: On successful sign-in.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 401 Unauthorized: When the email or password is incorrect.
 */
authRouter.post('/sign-in', signInValidator, wrapRequestHandler(signInController));

export default authRouter;
