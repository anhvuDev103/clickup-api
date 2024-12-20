import { NextFunction, Request, Response } from 'express';
import { ValidationChain, ValidationError as ExpressValidationError } from 'express-validator';
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema';
import _ from 'lodash';

import { HttpStatus } from '@/constants/enums';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { BaseError, ValidationError } from '@/models/Errors.model';

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const errors = await validation.run(req);

    const isNoError = errors.every((error) => error.isEmpty());
    if (isNoError) {
      return next();
    }

    const errorObject: Record<string, ExpressValidationError> = {};

    errors.forEach((error) => {
      if (!error.isEmpty()) {
        const [[key, details]] = Object.entries(error.mapped());

        if (details.msg instanceof BaseError && details.msg.status !== HttpStatus.UnprocessableEntity) {
          return next(details.msg);
        }

        errorObject[key] = _.pick(details, ['value', 'msg']) as ExpressValidationError;
      }
    });

    for (const error of errors) {
      if (!error.isEmpty()) {
        const [[key, details]] = Object.entries(error.mapped());

        if (details.msg instanceof BaseError && details.msg.status !== HttpStatus.UnprocessableEntity) {
          return next(details.msg);
        }

        errorObject[key] = _.pick(details, ['value', 'msg']) as ExpressValidationError;
      }
    }

    const validationError = new ValidationError({
      status: HttpStatus.UnprocessableEntity,
      message: RESPONSE_MESSAGE.VALIDATION_FAILED,
      details: errorObject,
    });

    return next(validationError);
  };
};

export const getValidationMessage = (errorDetail?: string) => (field: string, customErrorDetail?: string) => {
  const text = `The field '{{field}}' ${errorDetail || customErrorDetail || 'is invalid'}.`;
  return text.replace('{{field}}', field);
};

export const getCustomMessage = getValidationMessage();
export const getRequiredMessage = getValidationMessage('is required');
export const getInvalidMessage = getValidationMessage('is invalid');
export const getIsInMessage = (values: (number | string)[]) => {
  const quotedCharacters = values.map((value) => {
    if (typeof value === 'number') {
      return value;
    }

    return `'${value}'`;
  });
  return getValidationMessage(`must be one of the following: ${quotedCharacters.join(', ')}`);
};
