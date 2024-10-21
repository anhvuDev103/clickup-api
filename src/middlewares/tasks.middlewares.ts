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
      projectId: getObjectIdValidatorSchema('projectId'),
      categoryId: getObjectIdValidatorSchema('categoryId'),
      subcategoryId: getObjectIdValidatorSchema('subcategoryId'),
    },
    ['body'],
  ),
);
