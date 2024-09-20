import express from 'express';

import {
  createListController,
  createSpaceController,
  getHierarchyController,
} from '@/controllers/hierarchy.controllers';
import { accessTokenValidator } from '@/middlewares/auth.middlewares';
import { createListValidator, createSpaceValidator } from '@/middlewares/hierarchy.middlewares';
import { getWorkspaceIdValidator } from '@/middlewares/workspaces.middlewares';
import { wrapRequestHandler } from '@/utils/error-handler';

const hierarchyRouterRouter = express.Router();

/**========================================================================================================================
 * GET /hierarchy
 *
 * Request headers:
 * {
 *    Authorization: Bearer {{access_token}}
 * }
 *
 * Request body:
 * {
 *    workspace_id: ObjectId
 * }
 *
 * Response:
 * - 200 OK: On successful getting hierarchy.
 * - 401 Unauthorized: If the token is invalid, expired.
 * - 422 Unprocessable Entity: When body data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
hierarchyRouterRouter.get(
  '/',
  accessTokenValidator,
  getWorkspaceIdValidator(),
  wrapRequestHandler(getHierarchyController),
);

/**========================================================================================================================
 * POST /hierarchy/space
 *
 * Request headers:
 * {
 *    Authorization: Bearer {{access_token}}
 * }
 *
 * Request body:
 * {
 *    name: string
 *    description?: string
 *    is_private: boolean
 *    member_emails: string[]
 *    workspace_id: ObjectId
 * }
 *
 * Response:
 * - 200 OK: On successful creation of space.
 * - 401 Unauthorized: If the token is invalid, expired.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
hierarchyRouterRouter.post(
  '/space',
  accessTokenValidator,
  createSpaceValidator,
  wrapRequestHandler(createSpaceController),
);

/**========================================================================================================================
 * POST /hierarchy/list
 *
 * Request headers:
 * {
 *    Authorization: Bearer {{access_token}}
 * }
 *
 * Request body:
 * {
 *    name: string
 *    is_private: boolean
 *    parent_id?: ObjectId
 *    member_emails: string[]
 * }
 *
 * Response:
 * - 200 OK: On successful creation of list.
 * - 401 Unauthorized: If the token is invalid, expired.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
hierarchyRouterRouter.post(
  '/list',
  accessTokenValidator,
  createListValidator,
  wrapRequestHandler(createListController),
);

export default hierarchyRouterRouter;
