import express from 'express';

import {
  createListController,
  createSpaceController,
  createSubListController,
  getHierarchyController,
} from '@/controllers/hierarchy.controllers';
import { accessTokenValidator } from '@/middlewares/auth.middlewares';
import { createListValidator, createSpaceValidator, createSubListValidator } from '@/middlewares/hierarchy.middlewares';
import { getObjectIdValidatorParams } from '@/middlewares/shared.middlewares';
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
 * POST /hierarchy/space/:space_id/sub_list
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
 *    member_emails: string[]
 * }
 *
 * Request params:
 * {
 *    space_id: ObjectId
 * }
 *
 * Response:
 * - 200 OK: On successful creation of list.
 * - 401 Unauthorized: If the token is invalid, expired.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
hierarchyRouterRouter.post(
  '/space/:space_id/sub_list',
  accessTokenValidator,
  getObjectIdValidatorParams(['space_id']),
  createSubListValidator,
  wrapRequestHandler(createSubListController),
);

/**========================================================================================================================
 * POST /hierarchy/space/:space_id/list
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
 *    member_emails: string[]
 * }
 *
 * Request params:
 * {
 *    space_id: ObjectId
 * }
 *
 * Response:
 * - 200 OK: On successful creation of list.
 * - 401 Unauthorized: If the token is invalid, expired.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
hierarchyRouterRouter.post(
  '/space/:space_id/list',
  accessTokenValidator,
  getObjectIdValidatorParams(['space_id']),
  createListValidator,
  wrapRequestHandler(createListController),
);

export default hierarchyRouterRouter;
