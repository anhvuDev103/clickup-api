import { checkSchema } from 'express-validator';

import { validate } from '@/utils/validate';

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
