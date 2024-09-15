import express from 'express';

import { forgotPasswordController, signInController, signUpController } from '@/controllers/auth.controllers';
import { signInValidator, signUpValidator } from '@/middlewares/auth.middlewares';
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
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 401 Unauthorized: When the password is incorrect.
 */
authRouter.post('/sign-in', signInValidator, wrapRequestHandler(signInController));

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

export default authRouter;
