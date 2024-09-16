import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { CreateWorkspaceRequestBody, GetWorkspaceRequestParams } from '@/models/requests/users.requests';
import { BaseResponse } from '@/models/Response.model';
import usersService from '@/services/users.services';
import { TokenPayload } from '@/utils/jwt';

export const getProfileController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;

  const result = await usersService.getProfile(user_id);

  const response = new BaseResponse({
    result,
  });

  return res.status(response.status).json(response);
};

export const getWorkspaceController = async (req: Request<GetWorkspaceRequestParams>, res: Response) => {
  const { id } = req.params;
  const { user_id } = req.decoded_authorization as TokenPayload;

  const result = await usersService.getWorkspace(user_id, id);

  const response = new BaseResponse({
    result,
  });

  return res.status(response.status).json(response);
};

export const createWorkspaceController = async (
  req: Request<ParamsDictionary, unknown, CreateWorkspaceRequestBody>,
  res: Response,
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;

  await usersService.createWorkspace(user_id, req.body);

  const response = new BaseResponse();

  return res.status(response.status).json(response);
};
