import { checkSchema } from 'express-validator';

import HTTP_STATUS from '@/constants/http-status';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import {
  CONTAIN_LOWERCASE_CHARACTERS_REGEX,
  CONTAIN_NUMBERS_REGEX,
  CONTAIN_SPECIAL_CHARACTERS_REGEX,
  CONTAIN_UPPERCASE_CHARACTERS_REGEX,
} from '@/constants/regexs';
import { BaseError } from '@/models/Errors.model';
import databaseService from '@/services/database.services';
import { hashPassword } from '@/utils/crypto';
import { getCustomMessage, getInvalidMessage, getRequiredMessage, validate } from '@/utils/validate';

export const signUpValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: getRequiredMessage('name'),
        },
        trim: true,
      },
      email: {
        notEmpty: {
          errorMessage: getRequiredMessage('email'),
        },
        isEmail: {
          errorMessage: getInvalidMessage('email'),
        },
        trim: true,
      },
      password: {
        notEmpty: {
          errorMessage: getRequiredMessage('password'),
        },
        custom: {
          options: (value: string) => {
            //At least 8 characters
            if (value.length < 8) {
              throw new Error(getCustomMessage('password', 'must be 8 characters or longer'));
            }

            //At least 1 lowercase letter
            if (!CONTAIN_LOWERCASE_CHARACTERS_REGEX.test(value)) {
              throw new Error(getCustomMessage('password', 'must contain at least one lowercase letter'));
            }

            //At least 1 capital letter
            if (!CONTAIN_UPPERCASE_CHARACTERS_REGEX.test(value)) {
              throw new Error(getCustomMessage('password', 'must contain at least one capital letter'));
            }

            //contain 1 special character or 1 number
            if (!CONTAIN_NUMBERS_REGEX.test(value) && !CONTAIN_SPECIAL_CHARACTERS_REGEX.test(value)) {
              throw new Error(
                getCustomMessage('password', 'must contain at least one special character or one number'),
              );
            }

            return true;
          },
        },
        trim: true,
      },
    },
    ['body'],
  ),
);

export const signInValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: getRequiredMessage('email'),
        },
        isEmail: {
          errorMessage: getInvalidMessage('email'),
        },
        trim: true,
      },
      password: {
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({
              email: req.body.email,
              password: hashPassword(value),
            });

            if (!user) {
              throw new BaseError({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: RESPONSE_MESSAGE.INCORRECT_PASSWORD,
              });
            }

            return true;
          },
        },
      },
    },
    ['body'],
  ),
);
