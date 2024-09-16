import express from 'express';

import { checkEmailStatusController, sendOtpController } from '@/controllers/verification.controllers';
import { emailValidator } from '@/middlewares/verification.middlewares';
import { wrapRequestHandler } from '@/utils/error-handler';

const verificationRouter = express.Router();

/**========================================================================================================================
 * GET /verification/email
 *
 * Request body:
 * {
 *    email: string
 * }
 *
 * Response:
 * - 200 OK: Returns EmailStatusResponse.
 * - 422 Unprocessable Entity: When input data is invalid.
 */
verificationRouter.get('/email', emailValidator, wrapRequestHandler(checkEmailStatusController));

/**========================================================================================================================
 * POST /verification/send-otp
 *
 * Request body:
 * {
 *    email: string
 * }
 *
 * Response:
 * - 200 OK: When the OTP is successfully generated and sent to the user's email.
 * - 422 Unprocessable Entity: If the email is missing or invalid.
 * - 500 Internal Server Error: If there is an issue generating or sending the OTP.
 */
verificationRouter.post('/send-otp', emailValidator, wrapRequestHandler(sendOtpController));

export default verificationRouter;
