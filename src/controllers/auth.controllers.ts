import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { HttpStatus } from '@/constants/enums';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import {
  ChangePasswordRequestBody,
  ForgotPasswordRequestBody,
  LogOutRequestBody,
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
    status: HttpStatus.Created,
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

export const logOutController = async (req: Request<ParamsDictionary, unknown, LogOutRequestBody>, res: Response) => {
  const { refresh_token } = req.body;
  const { user_id } = req.decoded_authorization as TokenPayload;

  await authService.logout(user_id, refresh_token);

  const response = new BaseResponse({
    message: RESPONSE_MESSAGE.SUCCESSFULLY_LOGGED_OUT,
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

export const changePasswordController = async (
  req: Request<ParamsDictionary, unknown, ChangePasswordRequestBody>,
  res: Response,
) => {
  const { new_password } = req.body;
  const { user_id } = req.decoded_authorization as TokenPayload;

  await authService.changePassword(user_id, new_password);

  const response = new BaseResponse({
    message: RESPONSE_MESSAGE.PASSWORD_SUCCESSFULLY_CHANGED,
  });

  return res.status(response.status).json(response);
};
