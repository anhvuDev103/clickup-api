import { NextFunction, Request, RequestHandler, Response } from 'express';
import { checkSchema, ParamSchema } from 'express-validator';
import _, { isEmpty } from 'lodash';
import { isEmail, isMongoId } from 'validator';

import { HttpStatus } from '@/constants/enums';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import {
  CONTAIN_LOWERCASE_CHARACTERS_REGEX,
  CONTAIN_NUMBERS_REGEX,
  CONTAIN_SPECIAL_CHARACTERS_REGEX,
  CONTAIN_UPPERCASE_CHARACTERS_REGEX,
} from '@/constants/regexs';
import { BaseError } from '@/models/Errors.model';
import { getCustomMessage, getInvalidMessage, getRequiredMessage, validate } from '@/utils/validate';

export const getPasswordValidatorSchema = (field = 'password'): ParamSchema => {
  return {
    notEmpty: {
      errorMessage: getRequiredMessage(field),
    },
    custom: {
      options: (value: string) => {
        //At least 8 characters
        if (value.length < 8) {
          throw new Error(getCustomMessage(field, 'must be 8 characters or longer'));
        }

        //At least 1 lowercase letter
        if (!CONTAIN_LOWERCASE_CHARACTERS_REGEX.test(value)) {
          throw new Error(getCustomMessage(field, 'must contain at least one lowercase letter'));
        }

        //At least 1 capital letter
        if (!CONTAIN_UPPERCASE_CHARACTERS_REGEX.test(value)) {
          throw new Error(getCustomMessage(field, 'must contain at least one capital letter'));
        }

        //contain 1 special character or 1 number
        if (!CONTAIN_NUMBERS_REGEX.test(value) && !CONTAIN_SPECIAL_CHARACTERS_REGEX.test(value)) {
          throw new Error(getCustomMessage(field, 'must contain at least one special character or one number'));
        }

        return true;
      },
    },
    trim: true,
  };
};

export const getObjectIdValidatorSchema = (field = 'id', excludes?: ('notEmpty' | 'isMongoId')[]): ParamSchema => {
  const overrides: ParamSchema = {};

  if (excludes && Array.isArray(excludes)) {
    excludes.forEach((exclude) => {
      overrides[exclude] = undefined;
    });
  }

  return {
    notEmpty: {
      errorMessage: getRequiredMessage(field),
    },
    isMongoId: {
      errorMessage: getInvalidMessage(field),
    },
    trim: true,
    ...overrides,
  };
};

export const getMemberEmailsValidatorSchema = (): ParamSchema => {
  return {
    custom: {
      options: async (value: unknown) => {
        if (!Array.isArray(value) || value.some((v) => !isEmail(v))) {
          throw new Error(getCustomMessage('member_emails', 'must be an email array'));
        }

        return true;
      },
    },
  };
};

export const getObjectIdsValidatorSchema = (field = 'ids'): ParamSchema => {
  return {
    custom: {
      options: async (value: unknown) => {
        if (!Array.isArray(value) || value.some((v) => !isMongoId(v))) {
          throw new Error(getCustomMessage(field, 'must be an ObjectId array'));
        }

        return true;
      },
    },
  };
};

export const getObjectIdValidatorParams = (fields: string[]) => {
  const fieldsSchema: Record<string, ParamSchema> = {};

  for (const field of fields) {
    fieldsSchema[field] = getObjectIdValidatorSchema(field);
  }

  return validate(checkSchema(fieldsSchema, ['params']));
};

export const filterAllowedFields = <T>(fields: (keyof T)[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = _.pick(req.body, fields);

    next();
  };
};

export const checkEmptyBody = (middleware: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || isEmpty(req.body)) {
      const error = new BaseError({
        status: HttpStatus.UnprocessableEntity,
        message: RESPONSE_MESSAGE.EMPTY_REQUEST_BODY,
      });

      next(error);
    }

    middleware(req, res, next);
  };
};
