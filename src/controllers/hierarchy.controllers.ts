import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { CreateSpaceRequestBody } from '@/models/requests/hierarchy.requests';
import { BaseResponse } from '@/models/Response.model';
import spacesService from '@/services/hierarchy.services';
import { TokenPayload } from '@/utils/jwt';

export const createSpaceController = async (
  req: Request<ParamsDictionary, unknown, CreateSpaceRequestBody>,
  res: Response,
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;

  await spacesService.createSpace(user_id, req.body);

  const response = new BaseResponse();

  return res.status(response.status).json(response);
};
