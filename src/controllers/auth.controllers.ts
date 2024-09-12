import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import HTTP_STATUS from '@/constants/http-status';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { SignInRequestBody, SignUpRequestBody } from '@/models/requests/auth.requests';
import { BaseResponse } from '@/models/Response.model';
import User from '@/models/schemas/User.shema';
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

export const signInController = async (req: Request<ParamsDictionary, unknown, SignInRequestBody>, res: Response) => {
  const { _id: user_id } = req.user as User;

  const result = await authService.signIn(user_id.toString());

  const response = new BaseResponse({
    message: RESPONSE_MESSAGE.SUCCESSFULLY_SIGNED_IN,
    result,
  });

  return res.status(response.status).json(response);
};
