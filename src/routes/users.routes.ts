import express from 'express';

import { getProfileController } from '@/controllers/users.controllers';
import { accessTokenValidator } from '@/middlewares/auth.middlewares';
import { wrapRequestHandler } from '@/utils/error-handler';

const usersRouter = express.Router();

/**========================================================================================================================
 * GET /users/profile
 *
 * Request headers:
 * {
 *    Authorization: Bearer {{access_token}}
 * }
 *
 * Response:
 * - 200 OK: Returns SimpleUserProfileResponse.
 * - 404 Not Found: If the user associated with the token is not found.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
usersRouter.get('/profile', accessTokenValidator, wrapRequestHandler(getProfileController));

export default usersRouter;
