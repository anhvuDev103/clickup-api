import express from 'express';

import { checkEmailStatusController } from '@/controllers/verification.controllers';
import { emailValidator } from '@/middlewares/verification.middlewares';
import { wrapRequestHandler } from '@/utils/error-handler';

const verificationRouter = express.Router();

/**
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

export default verificationRouter;
