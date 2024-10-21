import express from 'express';

import { createTaskController, getTasksController } from '@/controllers/tasks.controllers';
import { accessTokenValidator } from '@/middlewares/auth.middlewares';
import { createTaskValidator, getTaskValidator } from '@/middlewares/tasks.middlewares';
import { wrapRequestHandler } from '@/utils/error-handler';

const tasksRouter = express.Router();

/**========================================================================================================================
 * POST /tasks
 *
 * Request headers:
 * {
 *    Authorization: Bearer {{access_token}}
 * }
 *
 * Request body:
 * {
 *    name: string
 *    assignees: ObjectId[]
 *    priority?: TaskPriority
 *    status?: TaskStatus
 *    project_id: ObjectId
 *    category_id: ObjectId
 *    subcategory_id: ObjectId
 * }
 *
 * Response:
 * - 200 OK: On successful creation of task.
 * - 404 Not Found: If the user associated with the token is not found.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
tasksRouter.post('/', accessTokenValidator, createTaskValidator, wrapRequestHandler(createTaskController));

/**========================================================================================================================
 * GET /tasks
 *
 * Request headers:
 * {
 *    Authorization: Bearer {{access_token}}
 * }
 *
 * Request body:
 * {
 *    subcategory_id: ObjectId
 * }
 *
 * Response:
 * - 200 OK: On successfully getting the tasks.
 * - 404 Not Found: If the user associated with the token is not found.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
tasksRouter.get('/', accessTokenValidator, getTaskValidator, wrapRequestHandler(getTasksController));

export default tasksRouter;
