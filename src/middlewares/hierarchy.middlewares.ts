import { checkSchema } from 'express-validator';

import { getCustomMessage, getInvalidMessage, getRequiredMessage, validate } from '@/utils/validate';

import { getMemberEmailsValidatorSchema } from './shared.middlewares';

export const createProjectValidator = validate(
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
    },
    ['body'],
  ),
);

export const createSubCategoryValidator = validate(
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
      member_emails: getMemberEmailsValidatorSchema(),
    },
    ['body'],
  ),
);

export const createCategoryValidator = validate(
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
      member_emails: getMemberEmailsValidatorSchema(),
    },
    ['body'],
  ),
);
