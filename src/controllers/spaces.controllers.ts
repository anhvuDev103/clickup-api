import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { CreateSpaceRequestBody } from '@/models/requests/spaces.requests';
import { BaseResponse } from '@/models/Response.model';

export const createSpaceController = async (
  req: Request<ParamsDictionary, unknown, CreateSpaceRequestBody>,
  res: Response,
) => {
  // const { user_id } = req.decoded_authorization as TokenPayload;

  // const result = await spacesService.createSpace(user_id, req.body);

  const response = new BaseResponse({
    // result,
  });

  return res.status(response.status).json(response);
};
