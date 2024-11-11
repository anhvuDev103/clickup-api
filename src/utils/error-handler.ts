import { NextFunction, Request, RequestHandler, Response } from 'express';
import _ from 'lodash';

import { HttpStatus } from '@/constants/enums';
import { BaseError } from '@/models/Errors.model';

export const wrapRequestHandler = <P>(requestHandler: RequestHandler<P>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await requestHandler(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultErrorRequestHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof BaseError) {
    return res.status(err.status).json(_.omit(err, 'details'));
  }

  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, {
      enumerable: true,
    });
  });

  const error = new BaseError({
    status: HttpStatus.InternalServerError,
    message: err.message,
  });

  return res.status(HttpStatus.InternalServerError).json(_.omit(error, 'details'));
};
