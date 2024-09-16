import express from 'express';

import { logOutController, signInController, signUpController } from '@/controllers/auth.controllers';
import {
  accessTokenValidator,
  refreshTokenValidator,
  signInValidator,
  signUpValidator,
} from '@/middlewares/auth.middlewares';
import { wrapRequestHandler } from '@/utils/error-handler';

const authRouter = express.Router();

/**========================================================================================================================
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

/**========================================================================================================================
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
 * - 401 Unauthorized: When the password is incorrect.
 */
authRouter.post('/sign-in', signInValidator, wrapRequestHandler(signInController));

/**========================================================================================================================
 * DELETE /auth/log-out
 *
 * Request body:
 * {
 *    refresh_token: JWT token
 * }
 *
 * Response:
 * - 200 OK: When the user is successfully logged out and the refresh token is invalidated.
 * - 400 Bad Request: If the refresh token is invalid or missing.
 */
authRouter.delete('/log-out', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logOutController));

export default authRouter;
