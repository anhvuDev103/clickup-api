import express from 'express';

import { createSpaceController } from '@/controllers/spaces.controllers';
import { accessTokenValidator } from '@/middlewares/auth.middlewares';
import { createSpaceValidator } from '@/middlewares/spaces.middlewares';
import { wrapRequestHandler } from '@/utils/error-handler';

const spacesRouter = express.Router();

/**========================================================================================================================
 * POST /spaces
 *
 * Request headers:
 * {
 *    Authorization: Bearer {{access_token}}
 * }
 *
 * Request body:
 * {
 *    name: string
 *    description: string
 *    is_private: boolean
 *    member_emails: string[]
 * }
 *
 * Response:
 * - 200 OK: On successful creation of workspace.
 * - 404 Not Found: If the user associated with the token is not found.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
spacesRouter.post('/', accessTokenValidator, createSpaceValidator, wrapRequestHandler(createSpaceController));

export default spacesRouter;
