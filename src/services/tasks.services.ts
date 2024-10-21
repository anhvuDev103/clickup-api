import { ObjectId, WithId } from 'mongodb';

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
   * @param {string} payload.project_id - The task's project_id.
   * @param {string} payload.category_id - The task's category_id.
   * @param {string} payload.subcategory_id - The task's subcategory_id.
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
        project_id: new ObjectId(payload.project_id),
        category_id: new ObjectId(payload.category_id),
        subcategory_id: new ObjectId(payload.subcategory_id),
      }),
    );
  }

  /**========================================================================================================================
   * Get tasks.
   *
   * @param {string} user_id - The id of user.
   * @param {Object} subcategory_id - The id of subcategory.
   *
   * @returns {Promise<WithId<Task>[]>} - Returns a list of tasks that match the query filters.
   *
   * @throws {Error} if any database side errors occur.
   */

  async getTasks(subcategory_id: string): Promise<WithId<Task>[]> {
    const tasks = await databaseService.tasks
      .find({
        subcategory_id: new ObjectId(subcategory_id),
      })
      .toArray();

    return tasks;
  }
}

const tasksService = new TasksService();

export default tasksService;
