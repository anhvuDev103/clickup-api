import { ObjectId } from 'mongodb';

import { CreateTaskRequestBody } from '@/models/requests/tasks.requests';
import Task from '@/models/schemas/Task.schema';

import databaseService from './database.services';

class TasksService {
  /**========================================================================================================================
   * Create task.
   *
   * @param {string} user_id - The id of user.
   * @param {Object} payload - The id of workspace.
   * @param {string} payload.name - The task's name.
   * @param {string} payload.assignees - The task's assignees.
   * @param {string} payload.priority - The task's priority.
   * @param {string} payload.status - The task's status.
   * @param {string} payload.projectId - The task's projectId.
   * @param {string} payload.categoryId - The task's categoryId.
   * @param {string} payload.subcategoryId - The task's subcategoryId.
   *
   * @returns {Promise<void>} - Returns nothing.
   *
   * @throws {Error} if any database side errors occur.
   */

  async createTask(user_id: string, payload: CreateTaskRequestBody): Promise<void> {
    const assigneeObjectIds = payload.assignees.map((assignee) => new ObjectId(assignee));

    await databaseService.tasks.insertOne(
      new Task({
        ...payload,
        assignees: assigneeObjectIds,
        projectId: new ObjectId(payload.projectId),
        categoryId: new ObjectId(payload.categoryId),
        subcategoryId: new ObjectId(payload.subcategoryId),
      }),
    );
  }
}

const tasksService = new TasksService();

export default tasksService;
