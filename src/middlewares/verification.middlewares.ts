import { checkSchema } from 'express-validator';

import { getInvalidMessage, getRequiredMessage, validate } from '@/utils/validate';

export const emailValidator = validate(
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
    },
    ['body'],
  ),
);
