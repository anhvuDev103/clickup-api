import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import {
  CreateTaskRequestBody,
  GetTasksRequestBody,
  UpdateTaskRequestBody,
  UpdateTaskRequestParams,
} from '@/models/requests/tasks.requests';
import { BaseResponse } from '@/models/Response.model';
import tasksService from '@/services/tasks.services';
import { TokenPayload } from '@/utils/jwt';

export const createTaskController = async (
  req: Request<ParamsDictionary, unknown, CreateTaskRequestBody>,
  res: Response,
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;

  await tasksService.createTask(user_id, req.body);

  const response = new BaseResponse();

  return res.status(response.status).json(response);
};

export const getTasksController = async (
  req: Request<ParamsDictionary, unknown, GetTasksRequestBody>,
  res: Response,
) => {
  const { subcategory_id } = req.body;

  const result = await tasksService.getTasks(subcategory_id);

  const response = new BaseResponse({
    result,
  });

  return res.status(response.status).json(response);
};

export const updateTaskController = async (
  req: Request<UpdateTaskRequestParams, unknown, UpdateTaskRequestBody>,
  res: Response,
) => {
  const { task_id } = req.params;

  const result = await tasksService.updateTask(task_id, req.body);

  const response = new BaseResponse({
    result,
  });

  return res.status(response.status).json(response);
};
