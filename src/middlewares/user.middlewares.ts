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
import userService from '@/services/user.services';
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
        custom: {
          options: async (value: string) => {
            if (!value) {
              throw new Error(getRequiredMessage('email'));
            }

            const isEmailTaken = await userService.checkIfEmailExists(value);
            if (isEmailTaken) {
              throw new BaseError({ status: HTTP_STATUS.CONFLICT, message: RESPONSE_MESSAGE.EMAIL_ALREADY_TAKEN });
            }

            return true;
          },
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
        notEmpty: true,
      },
      password: {
        notEmpty: true,
      },
    },
    ['body'],
  ),
);
