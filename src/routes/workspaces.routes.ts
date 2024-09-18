import express from 'express';

import { createWorkspaceController, getWorkspaceController } from '@/controllers/workspaces.controllers';
import { accessTokenValidator } from '@/middlewares/auth.middlewares';
import { createWorkspaceValidator, getWorkspaceValidator } from '@/middlewares/workspaces.middlewares';
import { wrapRequestHandler } from '@/utils/error-handler';

const workspacesRouter = express.Router();

/**========================================================================================================================
 * POST /workspaces
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
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
workspacesRouter.post(
  '/',
  accessTokenValidator,
  createWorkspaceValidator,
  wrapRequestHandler(createWorkspaceController),
);

/**========================================================================================================================
 * GET /workspaces/:id
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
 * - 200 OK: Returns GetWorkspacesResponse.
 * - 404 Not Found: If the user associated with the token is not found.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
workspacesRouter.get('/:id', accessTokenValidator, getWorkspaceValidator, wrapRequestHandler(getWorkspaceController));

export default workspacesRouter;
