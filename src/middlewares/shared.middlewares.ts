import { checkSchema, ParamSchema } from 'express-validator';
import { isEmail } from 'validator';

import {
  CONTAIN_LOWERCASE_CHARACTERS_REGEX,
  CONTAIN_NUMBERS_REGEX,
  CONTAIN_SPECIAL_CHARACTERS_REGEX,
  CONTAIN_UPPERCASE_CHARACTERS_REGEX,
} from '@/constants/regexs';
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

export const getObjectIdValidatorSchema = (field = 'id'): ParamSchema => {
  return {
    notEmpty: {
      errorMessage: getRequiredMessage(field),
    },
    isMongoId: {
      errorMessage: getInvalidMessage(field),
    },
    trim: true,
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

export const getObjectIdValidatorParams = (fields: string[]) => {
  const fieldsSchema: Record<string, ParamSchema> = {};

  for (const field of fields) {
    fieldsSchema[field] = getObjectIdValidatorSchema(field);
  }

  return validate(checkSchema(fieldsSchema));
};
