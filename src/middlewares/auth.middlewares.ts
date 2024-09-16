import { Request } from 'express';
import { checkSchema } from 'express-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import _ from 'lodash';
import { ObjectId } from 'mongodb';

import HTTP_STATUS from '@/constants/http-status';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import {
  CONTAIN_LOWERCASE_CHARACTERS_REGEX,
  CONTAIN_NUMBERS_REGEX,
  CONTAIN_SPECIAL_CHARACTERS_REGEX,
  CONTAIN_UPPERCASE_CHARACTERS_REGEX,
} from '@/constants/regexs';
import { BaseError } from '@/models/Errors.model';
import { SignInRequestBody } from '@/models/requests/auth.requests';
import databaseService from '@/services/database.services';
import { hashPassword } from '@/utils/crypto';
import { TokenPayload, verifyToken } from '@/utils/jwt';
import { getCustomMessage, getInvalidMessage, getRequiredMessage, validate } from '@/utils/validate';

const passwordValidatorSchema = (field = 'password') => {
  return {
    notEmpty: {
      errorMessage: getRequiredMessage(field),
    },
    custom: {
      options: (value: string) => {
        //At least 8 characters
        if (value.length < 8) {
          throw new Error(getCustomMessage(field, 'must be 8 characters or longer'));
        }

        //At least 1 lowercase letter
        if (!CONTAIN_LOWERCASE_CHARACTERS_REGEX.test(value)) {
          throw new Error(getCustomMessage(field, 'must contain at least one lowercase letter'));
        }

        //At least 1 capital letter
        if (!CONTAIN_UPPERCASE_CHARACTERS_REGEX.test(value)) {
          throw new Error(getCustomMessage(field, 'must contain at least one capital letter'));
        }

        //contain 1 special character or 1 number
        if (!CONTAIN_NUMBERS_REGEX.test(value) && !CONTAIN_SPECIAL_CHARACTERS_REGEX.test(value)) {
          throw new Error(getCustomMessage(field, 'must contain at least one special character or one number'));
        }

        return true;
      },
    },
    trim: true,
  };
};

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
        notEmpty: {
          errorMessage: getRequiredMessage('email'),
        },
        isEmail: {
          errorMessage: getInvalidMessage('email'),
        },
        trim: true,
      },
      password: passwordValidatorSchema(),
      otp_code: {
        notEmpty: {
          errorMessage: getRequiredMessage('otp_code'),
        },
        isNumeric: {
          errorMessage: getInvalidMessage('otp_code'),
        },
        isLength: {
          options: {
            min: 4,
            max: 4,
          },
          errorMessage: getCustomMessage('otp_code', 'must be 4 characters'),
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
        notEmpty: {
          errorMessage: getRequiredMessage('email'),
        },
        isEmail: {
          errorMessage: getInvalidMessage('email'),
        },
        trim: true,
      },
      password: {
        custom: {
          options: async (value: string, { req }) => {
            const { email } = req.body as SignInRequestBody;

            const user = await databaseService.users.findOne({
              email,
              password: hashPassword(value),
            });

            if (!user) {
              throw new BaseError({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: RESPONSE_MESSAGE.INCORRECT_PASSWORD,
              });
            }

            (req as Request).user = user;

            return true;
          },
        },
      },
    },
    ['body'],
  ),
);

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: getRequiredMessage('refresh_token'),
        },
        isJWT: {
          errorMessage: getInvalidMessage('refresh_token'),
        },
        custom: {
          options: async (value: string, { req }) => {
            const { user_id } = (req as Request).decoded_authorization as TokenPayload;

            const refreshToken = await databaseService.refreshTokens.findOne({
              token: value,
              user_id: new ObjectId(user_id),
            });
            console.log('>> Check | refreshToken:', { value, refreshToken });

            if (!refreshToken) {
              throw new BaseError({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: RESPONSE_MESSAGE.REFRESH_TOKEN_DOES_NOT_EXIST,
              });
            }

            return true;
          },
        },
      },
    },
    ['body'],
  ),
);

export const resetPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: {
        notEmpty: {
          errorMessage: getRequiredMessage('forgot_password_token'),
        },
        isJWT: {
          errorMessage: getInvalidMessage('forgot_password_token'),
        },
        custom: {
          options: async (value: string, { req }) => {
            try {
              const decoded_forgot_password = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.FORGOT_PASSWORD_TOKEN_SECRET as string,
              });

              const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_forgot_password.user_id) });

              if (!user) {
                throw new BaseError({
                  status: HTTP_STATUS.NOT_FOUND,
                  message: RESPONSE_MESSAGE.USER_NOT_FOUND,
                });
              }

              (req as Request).decoded_forgot_password = decoded_forgot_password;

              return true;
            } catch (err) {
              if (err instanceof JsonWebTokenError) {
                throw new BaseError({
                  status: HTTP_STATUS.UNAUTHORIZED,
                  message: _.capitalize(err.message),
                });
              }

              throw err;
            }
          },
        },
        trim: true,
      },
      password: passwordValidatorSchema(),
      confirm_password: {
        ...passwordValidatorSchema('confirm_password'),
        custom: {
          options: (value: string, { req }) => {
            const { password } = req.body;

            if (hashPassword(value) !== hashPassword(password)) {
              throw new Error(RESPONSE_MESSAGE.PASSWORD_DOES_NOT_MATCH);
            }

            return true;
          },
        },
      },
    },
    ['body'],
  ),
);

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const [, token] = (value || '').split(' ');

            if (!token) {
              throw new BaseError({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: getRequiredMessage('access_token'),
              });
            }

            try {
              const decoded_authorization = await verifyToken({
                token,
                secretOrPublicKey: process.env.ACCESS_TOKEN_SECRET as string,
              });

              (req as Request).decoded_authorization = decoded_authorization;

              return true;
            } catch (err) {
              if (err instanceof JsonWebTokenError) {
                throw new BaseError({
                  status: HTTP_STATUS.UNAUTHORIZED,
                  message: _.capitalize(err.message),
                });
              }

              throw err;
            }
          },
        },
      },
    },
    ['headers'],
  ),
);
