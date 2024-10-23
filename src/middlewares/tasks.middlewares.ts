import { checkSchema } from 'express-validator';

import { TaskPriority, TaskStatus } from '@/constants/enums';
import { getIsInMessage, getRequiredMessage, validate } from '@/utils/validate';

import { getObjectIdsValidatorSchema, getObjectIdValidatorSchema } from './shared.middlewares';

const taskPriorities = Object.values(TaskPriority);
const TaskStatuses = Object.values(TaskStatus);

export const createTaskValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: getRequiredMessage('name'),
        },
        trim: true,
      },
      assignees: {
        notEmpty: {
          errorMessage: getRequiredMessage('assignees'),
        },
        ...getObjectIdsValidatorSchema('assignees'),
      },
      priority: {
        optional: true,
        isIn: {
          options: [taskPriorities],
          errorMessage: getIsInMessage(taskPriorities)('priority'),
        },
      },
      status: {
        optional: true,
        isIn: {
          options: [TaskStatuses],
          errorMessage: getIsInMessage(TaskStatuses)('status'),
        },
      },
      project_id: getObjectIdValidatorSchema('project_id'),
      category_id: getObjectIdValidatorSchema('category_id'),
      subcategory_id: getObjectIdValidatorSchema('subcategory_id'),
    },
    ['body'],
  ),
);

export const getTasksValidator = validate(
  checkSchema(
    {
      subcategory_id: getObjectIdValidatorSchema('subcategory_id'),
    },
    ['body'],
  ),
);

export const updateTaskValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        trim: true,
      },
      assignees: {
        optional: true,
        ...getObjectIdsValidatorSchema('assignees'),
      },
      priority: {
        optional: true,
        isIn: {
          options: [taskPriorities],
          errorMessage: getIsInMessage(taskPriorities)('priority'),
        },
      },
      status: {
        optional: true,
        isIn: {
          options: [TaskStatuses],
          errorMessage: getIsInMessage(TaskStatuses)('status'),
        },
      },
      project_id: {
        optional: true,
        ...getObjectIdValidatorSchema('project_id', ['notEmpty']),
      },
      category_id: {
        optional: true,
        ...getObjectIdValidatorSchema('category_id', ['notEmpty']),
      },
      subcategory_id: {
        optional: true,
        ...getObjectIdValidatorSchema('subcategory_id', ['notEmpty']),
      },
    },
    ['body'],
  ),
);
