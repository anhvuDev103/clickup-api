import express from 'express';

import {
  createCategoryController,
  createProjectController,
  createSubCategoryController,
  getHierarchyController,
} from '@/controllers/hierarchy.controllers';
import { accessTokenValidator } from '@/middlewares/auth.middlewares';
import {
  createCategoryValidator,
  createProjectValidator,
  createSubCategoryValidator,
} from '@/middlewares/hierarchy.middlewares';
import { getObjectIdValidatorParams } from '@/middlewares/shared.middlewares';
import { getWorkspaceIdValidatorHeaders } from '@/middlewares/workspaces.middlewares';
import { wrapRequestHandler } from '@/utils/error-handler';

const hierarchyRouterRouter = express.Router();

/**========================================================================================================================
 * GET /hierarchy
 *
 * Request headers:
 * {
 *    Authorization: Bearer {{access_token}}
 *    X-Workspace-Id: ObjectId
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
  getWorkspaceIdValidatorHeaders(),
  wrapRequestHandler(getHierarchyController),
);

/**========================================================================================================================
 * POST /hierarchy/projects
 *
 * Request headers:
 * {
 *    Authorization: Bearer {{access_token}}
 *    X-Workspace-Id: ObjectId
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
  '/projects',
  accessTokenValidator,
  getWorkspaceIdValidatorHeaders(),
  createProjectValidator,
  wrapRequestHandler(createProjectController),
);

/**========================================================================================================================
 * POST /hierarchy/projects/:project_id/subcategory
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
 *    project_id: ObjectId
 * }
 *
 * Response:
 * - 200 OK: On successful creation of list.
 * - 401 Unauthorized: If the token is invalid, expired.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
hierarchyRouterRouter.post(
  '/projects/:project_id/subcategory',
  accessTokenValidator,
  getObjectIdValidatorParams(['project_id']),
  createSubCategoryValidator,
  wrapRequestHandler(createSubCategoryController),
);

/**========================================================================================================================
 * POST /hierarchy/categories/:category_id/subcategory
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
 *    category_id: ObjectId
 * }
 *
 * Response:
 * - 200 OK: On successful creation of list.
 * - 401 Unauthorized: If the token is invalid, expired.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
hierarchyRouterRouter.post(
  '/categories/:category_id/subcategory',
  accessTokenValidator,
  getObjectIdValidatorParams(['category_id']),
  createSubCategoryValidator,
  wrapRequestHandler(createSubCategoryController),
);

/**========================================================================================================================
 * POST /hierarchy/projects/:project_id/category
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
 *    project_id: ObjectId
 * }
 *
 * Response:
 * - 200 OK: On successful creation of folder.
 * - 401 Unauthorized: If the token is invalid, expired.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
hierarchyRouterRouter.post(
  '/projects/:project_id/category',
  accessTokenValidator,
  getObjectIdValidatorParams(['project_id']),
  createCategoryValidator,
  wrapRequestHandler(createCategoryController),
);

export default hierarchyRouterRouter;
