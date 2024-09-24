import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import {
  CreateListRequestBody,
  CreateListRequestParams,
  CreateSpaceRequestBody,
  GetHierarchyRequestBody,
} from '@/models/requests/hierarchy.requests';
import { BaseResponse } from '@/models/Response.model';
import hierarchyService from '@/services/hierarchy.services';
import { TokenPayload } from '@/utils/jwt';

export const getHierarchyController = async (
  req: Request<ParamsDictionary, unknown, GetHierarchyRequestBody>,
  res: Response,
) => {
  const { workspace_id } = req.body;
  const { user_id } = req.decoded_authorization as TokenPayload;

  const result = await hierarchyService.getHierarchy(user_id, workspace_id);

  const response = new BaseResponse({
    result,
  });

  return res.status(response.status).json(response);
};

export const createSpaceController = async (
  req: Request<ParamsDictionary, unknown, CreateSpaceRequestBody>,
  res: Response,
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;

  await hierarchyService.createSpace(user_id, req.body);

  const response = new BaseResponse();

  return res.status(response.status).json(response);
};

export const createListController = async (
  req: Request<CreateListRequestParams, unknown, CreateListRequestBody>,
  res: Response,
) => {
  const { space_id } = req.params;
  const { user_id } = req.decoded_authorization as TokenPayload;

  await hierarchyService.createList({
    user_id,
    space_id,
    payload: req.body,
  });

  const response = new BaseResponse();

  return res.status(response.status).json(response);
};
