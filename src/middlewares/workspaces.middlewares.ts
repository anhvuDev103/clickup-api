import { checkSchema } from 'express-validator';
import { ObjectId } from 'mongodb';

import { WORKSPACE_ID_HEADERS } from '@/constants/common';
import { HttpStatus } from '@/constants/enums';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { BaseError } from '@/models/Errors.model';
import databaseService from '@/services/database.services';
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

export const getWorkspaceIdValidator = (checkExists = true) => {
  const checkExistsFn = async (value: string) => {
    const workspace = await databaseService.workspaces.findOne({ _id: new ObjectId(value) });

    if (!workspace) {
      throw new BaseError({
        status: HttpStatus.NotFound,
        message: RESPONSE_MESSAGE.WORKSPACE_NOT_FOUND,
      });
    }

    return true;
  };

  return validate(
    checkSchema(
      {
        workspace_id: {
          ...getObjectIdValidatorSchema(),
          custom: checkExists
            ? {
                options: checkExistsFn,
              }
            : undefined,
        },
      },
      ['params', 'body'],
    ),
  );
};

export const getWorkspaceIdValidatorHeaders = (checkExists = true) => {
  const checkExistsFn = async (value: string) => {
    const workspace = await databaseService.workspaces.findOne({ _id: new ObjectId(value) });

    if (!workspace) {
      throw new BaseError({
        status: HttpStatus.NotFound,
        message: RESPONSE_MESSAGE.WORKSPACE_NOT_FOUND,
      });
    }

    return true;
  };

  return validate(
    checkSchema(
      {
        [WORKSPACE_ID_HEADERS]: {
          ...getObjectIdValidatorSchema(WORKSPACE_ID_HEADERS),
          custom: checkExists
            ? {
                options: checkExistsFn,
              }
            : undefined,
        },
      },
      ['headers'],
    ),
  );
};
