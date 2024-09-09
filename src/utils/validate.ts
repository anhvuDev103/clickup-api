import { NextFunction, Request, Response } from 'express';
import { ValidationChain, ValidationError as ExpressValidationError } from 'express-validator';
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema';

import HTTP_STATUS from '@/constants/http-status';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { ValidationError } from '@/models/Errors.model';

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const errors = await validation.run(req);

    const isNoError = errors.every((error) => error.isEmpty());
    if (isNoError) {
      next();
    }

    const errorObject: Record<string, ExpressValidationError> = {};

    errors.forEach((error) => {
      if (!error.isEmpty()) {
        const [[key, details]] = Object.entries(error.mapped());
        errorObject[key] = details;
      }
    });

    const validationError = new ValidationError({
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      message: RESPONSE_MESSAGE.VALIDATION_FAILED,
      details: errorObject,
    });

    next(validationError);
  };
};
