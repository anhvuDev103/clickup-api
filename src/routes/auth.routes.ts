import express from 'express';

import {
  changePasswordController,
  forgotPasswordController,
  logOutController,
  resetPasswordController,
  signInController,
  signUpController,
} from '@/controllers/auth.controllers';
import {
  accessTokenValidator,
  changePasswordValidator,
  refreshTokenValidator,
  resetPasswordValidator,
  signInValidator,
  signUpValidator,
} from '@/middlewares/auth.middlewares';
import { emailValidator } from '@/middlewares/verification.middlewares';
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
 * - 401 Unauthorized: When the password is incorrect.
 * - 422 Unprocessable Entity: When input data is invalid.
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

/**========================================================================================================================
 * POST /auth/forgot-password
 *
 * Request body:
 * {
 *    email: string
 * }
 *
 * Response:
 * - 200 OK: If the password reset link is sent to the email.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 404 Not Found: If the email is not associated with any user account.
 */
authRouter.post('/forgot-password', emailValidator, wrapRequestHandler(forgotPasswordController));

/**========================================================================================================================
 * POST /auth/reset-password
 *
 * Request body:
 * {
 *    forgot_password_token: string
 *    password: string
 *    confirm_password: string
 * }
 *
 * Response:
 * - 200 OK: If the password is successfully reset.
 * - 401 Unauthorized: If the token is invalid, expired.
 * - 404 Not Found: If the user associated with the token is not found.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
authRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController));

/**========================================================================================================================
 * PATCH /auth/change-password
 *
 * Request headers:
 * {
 *    Authorization: Bearer {{access_token}}
 * }
 *
 * Request body:
 * {
 *    current_password: string
 *    new_password: string
 * }
 *
 * Response:
 * - 200 OK: If the password is successfully changed.
 * - 401 Unauthorized: If the current password is incorrect.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
authRouter.patch(
  '/change-password',
  accessTokenValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController),
);

export default authRouter;
