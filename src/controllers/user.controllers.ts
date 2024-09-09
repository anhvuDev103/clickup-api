import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { RESPONSE_MESSAGE } from '@/constants/messages';
import { SignUpRequestBody } from '@/models/requests/user.requests';
import userService from '@/services/user.services';

export const signUpController = async (req: Request<ParamsDictionary, unknown, SignUpRequestBody>, res: Response) => {
  const result = await userService.signUp(req.body);

  return res.json({
    message: RESPONSE_MESSAGE.SUCCESSFULLY_SIGNED_IN,
    result,
  });
};

export const signInController = (req: Request, res: Response) => {
  return res.json({
    message: RESPONSE_MESSAGE.SUCCESSFULLY_SIGNED_IN,
  });
};
