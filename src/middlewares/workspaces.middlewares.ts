import { checkSchema } from 'express-validator';

import { getRequiredMessage, validate } from '@/utils/validate';

import { getMemberEmailsValidatorSchema, getObjectIdValidatorSchema } from './shared.middlewares';

export const createWorkspaceValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: getRequiredMessage('name'),
        },
        trim: true,
      },
      member_emails: getMemberEmailsValidatorSchema(),
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
