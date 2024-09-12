import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import HTTP_STATUS from '@/constants/http-status';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { SignUpRequestBody } from '@/models/requests/auth.requests';
import { BaseResponse } from '@/models/Response.model';
import authService from '@/services/auth.services';

export const signUpController = async (req: Request<ParamsDictionary, unknown, SignUpRequestBody>, res: Response) => {
  const result = await authService.signUp(req.body);

  const response = new BaseResponse({
    status: HTTP_STATUS.CREATED,
    message: RESPONSE_MESSAGE.SUCCESSFULLY_SIGNED_UP,
    result,
  });

  return res.status(response.status).json(response);
};

export const signInController = (req: Request, res: Response) => {
  return res.json({
    message: RESPONSE_MESSAGE.SUCCESSFULLY_SIGNED_IN,
  });
};
