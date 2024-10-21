import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { WORKSPACE_ID_HEADERS } from '@/constants/common';
import { HttpStatus } from '@/constants/enums';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { BaseError } from '@/models/Errors.model';
import {
  CreateCategoryRequestBody,
  CreateCategoryRequestParams,
  CreateProjectRequestBody,
  CreateSubCategoryRequestBody,
  CreateSubCategoryRequestParams,
  GetHierarchyRequestBody,
} from '@/models/requests/hierarchy.requests';
import { BaseResponse } from '@/models/Response.model';
import hierarchyService from '@/services/hierarchy.services';
import { TokenPayload } from '@/utils/jwt';

export const getHierarchyController = async (
  req: Request<ParamsDictionary, unknown, GetHierarchyRequestBody>,
  res: Response,
) => {
  const workspace_id = req.header(WORKSPACE_ID_HEADERS) as string;
  const { user_id } = req.decoded_authorization as TokenPayload;

  const result = await hierarchyService.getHierarchy(user_id, workspace_id);

  const response = new BaseResponse({
    result,
  });

  return res.status(response.status).json(response);
};

export const createProjectController = async (
  req: Request<ParamsDictionary, unknown, CreateProjectRequestBody>,
  res: Response,
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;

  await hierarchyService.createProject(user_id, req.body);

  const response = new BaseResponse();

  return res.status(response.status).json(response);
};

export const createSubCategoryController = async (
  req: Request<CreateSubCategoryRequestParams, unknown, CreateSubCategoryRequestBody>,
  res: Response,
) => {
  const { project_id, category_id } = req.params;
  const { user_id } = req.decoded_authorization as TokenPayload;

  const parent_id = project_id || category_id;

  if (!parent_id) {
    throw new BaseError({
      status: HttpStatus.BadRequest,
      message: RESPONSE_MESSAGE.PARENT_NOT_FOUND,
    });
  }

  await hierarchyService.createSubCategory({
    user_id,
    parent_id,
    payload: req.body,
  });

  const response = new BaseResponse();

  return res.status(response.status).json(response);
};

export const createCategoryController = async (
  req: Request<CreateCategoryRequestParams, unknown, CreateCategoryRequestBody>,
  res: Response,
) => {
  const { project_id } = req.params;
  const { user_id } = req.decoded_authorization as TokenPayload;

  await hierarchyService.createCategory({
    user_id,
    project_id,
    payload: req.body,
  });

  const response = new BaseResponse();

  return res.status(response.status).json(response);
};
