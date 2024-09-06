import { checkSchema } from 'express-validator';

import { validate } from '@/utils/validate';

export const signInValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: true,
      },
      password: {
        isString: true,
      },
    },
    ['body'],
  ),
);
