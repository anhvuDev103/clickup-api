import express from 'express';

import { createTaskController } from '@/controllers/tasks.controllers';
import { accessTokenValidator } from '@/middlewares/auth.middlewares';
import { createTaskValidator } from '@/middlewares/tasks.middlewares';
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
 *    projectId: ObjectId
 *    categoryId: ObjectId
 *    subcategoryId: ObjectId
 * }
 *
 * Response:
 * - 200 OK: On successful creation of task.
 * - 404 Not Found: If the user associated with the token is not found.
 * - 422 Unprocessable Entity: When input data is invalid.
 * - 500 Internal Server Error: If there is an issue on the database side.
 */
tasksRouter.post('/', accessTokenValidator, createTaskValidator, wrapRequestHandler(createTaskController));

export default tasksRouter;
