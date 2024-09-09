import { NextFunction, Request, RequestHandler, Response } from 'express';

import HTTP_STATUS from '@/constants/http-status';
import { BaseError } from '@/models/Errors.model';

export const wrapRequestHandler = (requestHandler: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await requestHandler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultErrorRequestHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof BaseError) {
    return res.status(err.status).json(err);
  }

  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, {
      enumerable: true,
    });
  });

  const error = new BaseError({
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: err.message,
  });

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(error);
};
