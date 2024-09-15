import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import HTTP_STATUS from '@/constants/http-status';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import {
  ForgotPasswordRequestBody,
  ResetPasswordRequestBody,
  SignInRequestBody,
  SignUpRequestBody,
} from '@/models/requests/auth.requests';
import { BaseResponse } from '@/models/Response.model';
import User from '@/models/schemas/User.shema';
import authService from '@/services/auth.services';
import { TokenPayload } from '@/utils/jwt';

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

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, unknown, ForgotPasswordRequestBody>,
  res: Response,
) => {
  const { email } = req.body;

  await authService.forgotPassword(email);

  const response = new BaseResponse({
    message: RESPONSE_MESSAGE.RESET_PASSWORD_LINK_HAS_BEEN_SUCCESSFULLY_SENT,
  });

  return res.status(response.status).json(response);
};

export const resetPasswordController = async (
  req: Request<ParamsDictionary, unknown, ResetPasswordRequestBody>,
  res: Response,
) => {
  const { password } = req.body;
  const { user_id } = req.decoded_forgot_password as TokenPayload;

  await authService.resetPassword(user_id, password);

  const response = new BaseResponse({
    message: RESPONSE_MESSAGE.PASSWORD_SUCCESSFULLY_RESET,
  });

  return res.status(response.status).json(response);
};
