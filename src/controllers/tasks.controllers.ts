import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { CreateTaskRequestBody } from '@/models/requests/tasks.requests';
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
