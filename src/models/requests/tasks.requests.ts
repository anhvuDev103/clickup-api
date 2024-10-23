import { ParamsDictionary } from 'express-serve-static-core';

import { TaskPriority, TaskStatus } from '@/constants/enums';

export interface CreateTaskRequestBody {
  name: string;
  assignees: string[];
  priority?: TaskPriority;
  status?: TaskStatus;
  project_id: string;
  category_id: string;
  subcategory_id: string;
}

export interface GetTasksRequestBody {
  subcategory_id: string;
}

export interface UpdateTaskRequestParams extends ParamsDictionary {
  task_id: string;
}

export interface UpdateTaskRequestBody {
  name?: string;
  assignees?: string[];
  priority?: TaskPriority;
  status?: TaskStatus;
  project_id?: string;
  category_id?: string;
  subcategory_id?: string;
}
