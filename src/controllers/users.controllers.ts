import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { SignUpRequestBody } from '@/models/requests/auth.requests';
import { BaseResponse } from '@/models/Response.model';
import usersService from '@/services/users.services';
import { TokenPayload } from '@/utils/jwt';

export const getProfileController = async (
  req: Request<ParamsDictionary, unknown, SignUpRequestBody>,
  res: Response,
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;

  const result = await usersService.getProfile(user_id);

  const response = new BaseResponse({
    result,
  });

  return res.status(response.status).json(response);
};
