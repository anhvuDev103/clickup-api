import { checkSchema } from 'express-validator';
import { isEmail } from 'validator';

import { RESPONSE_MESSAGE } from '@/constants/messages';
import { getInvalidMessage, getRequiredMessage, validate } from '@/utils/validate';

import { getObjectIdValidatorSchema } from './shared.middlewares';

export const createWorkspaceValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: getRequiredMessage('name'),
        },
        trim: true,
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

export const getWorkspaceValidator = validate(
  checkSchema(
    {
      id: getObjectIdValidatorSchema(),
    },
    ['params'],
  ),
);
