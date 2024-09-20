import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { CreateWorkspaceRequestBody, GetWorkspaceRequestParams } from '@/models/requests/workspaces.requests';
import { BaseResponse } from '@/models/Response.model';
import workspacesService from '@/services/workspaces.services';
import { TokenPayload } from '@/utils/jwt';

export const getWorkspaceController = async (req: Request<GetWorkspaceRequestParams>, res: Response) => {
  const { workspace_id } = req.params;
  const { user_id } = req.decoded_authorization as TokenPayload;

  const result = await workspacesService.getWorkspace(user_id, workspace_id);

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

  await workspacesService.createWorkspace(user_id, req.body);

  const response = new BaseResponse();

  return res.status(response.status).json(response);
};
