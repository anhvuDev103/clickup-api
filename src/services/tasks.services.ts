import { ObjectId, WithId } from 'mongodb';

import { HttpStatus } from '@/constants/enums';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { BaseError } from '@/models/Errors.model';
import { CreateTaskRequestBody, UpdateTaskRequestBody } from '@/models/requests/tasks.requests';
import Task from '@/models/schemas/Task.schema';
import { transformStringToObjectId } from '@/utils/common';

import databaseService from './database.services';

class TasksService {
  /**========================================================================================================================
   * Create task.
   *
   * @param {string} user_id - The id of user.
   * @param {CreateTaskRequestBody} payload - An object containing task create information.
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
   * @param {string} subcategory_id - The id of subcategory.
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

  /**========================================================================================================================
   * Update a task.
   *
   * @param {string} task_id - The id of task.
   * @param {UpdateTaskRequestBody} payload - An object containing task update information.
   * @param {string}  payload.name - The task's name.
   * @param {string} payload.assignees - The task's assignees.
   * @param {string} payload.priority - The task's priority.
   * @param {string} payload.status - The task's status.
   * @param {string} payload.project_id - The task's project_id.
   * @param {string} payload.category_id - The task's category_id.
   * @param {string} payload.subcategory_id - The task's subcategory_id.
   *
   * @returns {Promise<WithId<Task>>} - Returns the updated task.
   *
   * @throws {Error} if any database side errors occur.
   */

  async updateTask(task_id: string, payload: UpdateTaskRequestBody): Promise<WithId<Task>> {
    const task = await databaseService.tasks.findOneAndUpdate(
      {
        _id: new ObjectId(task_id),
      },
      {
        $set: {
          ...transformStringToObjectId(payload as Record<string, string>),
        },
        $currentDate: {
          updated_at: true,
        },
      },
      {
        returnDocument: 'after',
      },
    );

    if (!task)
      throw new BaseError({
        status: HttpStatus.NotFound,
        message: RESPONSE_MESSAGE.TASK_NOT_FOUND,
      });

    return task;
  }
}

const tasksService = new TasksService();

export default tasksService;
