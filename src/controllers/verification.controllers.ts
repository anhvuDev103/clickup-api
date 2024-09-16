import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { CheckEmailRequestBody, SendOtpRequestBody } from '@/models/requests/verification.requests';
import { BaseResponse } from '@/models/Response.model';
import verificationService from '@/services/verification.services';

export const checkEmailStatusController = async (
  req: Request<ParamsDictionary, unknown, CheckEmailRequestBody>,
  res: Response,
) => {
  const { email } = req.body;

  const result = await verificationService.getEmailStatus(email);

  const response = new BaseResponse({ result });

  return res.status(response.status).json(response);
};

export const sendOtpController = async (req: Request<ParamsDictionary, unknown, SendOtpRequestBody>, res: Response) => {
  const { email } = req.body;

  await verificationService.sendOtp(email);

  const response = new BaseResponse();

  return res.status(response.status).json(response);
};
