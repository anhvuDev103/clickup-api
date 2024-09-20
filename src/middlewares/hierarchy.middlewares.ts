import { checkSchema } from 'express-validator';

import { getCustomMessage, getInvalidMessage, getRequiredMessage, validate } from '@/utils/validate';

import { getMemberEmailsValidatorSchema, getObjectIdValidatorSchema } from './shared.middlewares';

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
        optional: true,
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
      member_emails: getMemberEmailsValidatorSchema(),
      workspace_id: getObjectIdValidatorSchema('workspace_id'),
    },
    ['body'],
  ),
);

export const createListValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: getRequiredMessage('name'),
        },
        isLength: {
          errorMessage: getCustomMessage('name', 'should not go over 99 characters'),
          options: {
            max: 99,
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
      parent_id: {
        ...getObjectIdValidatorSchema('parent_id'),
        optional: true,
      },
      member_emails: getMemberEmailsValidatorSchema(),
    },
    ['body'],
  ),
);
