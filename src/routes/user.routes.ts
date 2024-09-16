import express from 'express';

import {
  createWorkspaceController,
  getProfileController,
  getWorkspaceController,
} from '@/controllers/users.controllers';
import { accessTokenValidator } from '@/middlewares/auth.middlewares';
import { createWorkspaceValidator } from '@/middlewares/users.middlewares';
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
 * - 200 OK: Returns GetProfileResponseResponse.
 * - 404 Not Found: If the user associated with the token is not found.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
usersRouter.get('/profile', accessTokenValidator, wrapRequestHandler(getProfileController));

/**========================================================================================================================
 * GET /users/workspaces/:id
 *
 * Request headers:
 * {
 *    Authorization: Bearer {{access_token}}
 * }
 *
 * Request params:
 * {
 *    id: ObjectId
 * }
 *
 * Response:
 * - 200 OK: Returns GetWorkspacesResponseResponse.
 * - 404 Not Found: If the user associated with the token is not found.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
usersRouter.get('/workspaces/:id', accessTokenValidator, wrapRequestHandler(getWorkspaceController));

/**========================================================================================================================
 * POST /users/workspaces
 *
 * Request headers:
 * {
 *    Authorization: Bearer {{access_token}}
 * }
 *
 * Request body:
 * {
 *    name: string
 *    member_emails: string[]
 * }
 *
 * Response:
 * - 200 OK: On successful creation of workspace.
 * - 404 Not Found: If the user associated with the token is not found.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
usersRouter.post(
  '/workspaces',
  accessTokenValidator,
  createWorkspaceValidator,
  wrapRequestHandler(createWorkspaceController),
);

export default usersRouter;
