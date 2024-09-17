import { checkSchema } from 'express-validator';
import { isEmail } from 'validator';

import { RESPONSE_MESSAGE } from '@/constants/messages';
import { getCustomMessage, getInvalidMessage, getRequiredMessage, validate } from '@/utils/validate';

export const createSpaceValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: getRequiredMessage('name'),
        },
        trim: true,
      },
      description: {
        notEmpty: {
          errorMessage: getRequiredMessage('description'),
        },
        isLength: {
          errorMessage: getCustomMessage('description', 'should not go over 350 characters'),
          options: {
            max: 350,
          },
        },
        trim: true,
      },
      is_private: {
        notEmpty: {
          errorMessage: getRequiredMessage('is_private'),
        },
        isBoolean: {
          errorMessage: getInvalidMessage('is_private'),
        },
      },
      member_emails: {
        custom: {
          options: async (value: unknown) => {
            if (!Array.isArray(value) || value.some((v) => !isEmail(v))) {
              throw new Error(RESPONSE_MESSAGE.MEMBERS_MUST_BE_AN_EMAIL_ARRAY);
            }

            return true;
          },
        },
      },
    },
    ['body'],
  ),
);
