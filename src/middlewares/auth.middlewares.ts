import { Request } from 'express';
import { checkSchema } from 'express-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import _ from 'lodash';
import { ObjectId } from 'mongodb';

import { HttpStatus } from '@/constants/enums';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { BaseError } from '@/models/Errors.model';
import { SignInRequestBody } from '@/models/requests/auth.requests';
import databaseService from '@/services/database.services';
import { hashPassword } from '@/utils/crypto';
import { TokenPayload, verifyToken } from '@/utils/jwt';
import { getCustomMessage, getInvalidMessage, getRequiredMessage, validate } from '@/utils/validate';

import { getPasswordValidatorSchema } from './shared.middlewares';

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
      password: getPasswordValidatorSchema(),
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
                status: HttpStatus.Unauthorized,
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
            const refreshToken = await databaseService.refreshTokens.findOne({
              token: value,
            });

            if (!refreshToken) {
              throw new BaseError({
                status: HttpStatus.Unauthorized,
                message: RESPONSE_MESSAGE.REFRESH_TOKEN_DOES_NOT_EXIST,
              });
            }

            const decoded_refresh_token = await verifyToken({
              token: value,
              secretOrPublicKey: process.env.REFRESH_TOKEN_SECRET as string,
            });

            (req as Request).decoded_refresh_token = decoded_refresh_token;

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
                status: HttpStatus.Unauthorized,
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
                  status: HttpStatus.Unauthorized,
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
                  status: HttpStatus.NotFound,
                  message: RESPONSE_MESSAGE.USER_NOT_FOUND,
                });
              }

              (req as Request).decoded_forgot_password = decoded_forgot_password;

              return true;
            } catch (err) {
              if (err instanceof JsonWebTokenError) {
                throw new BaseError({
                  status: HttpStatus.Unauthorized,
                  message: _.capitalize(err.message),
                });
              }

              throw err;
            }
          },
        },
        trim: true,
      },
      password: getPasswordValidatorSchema(),
      confirm_password: {
        ...getPasswordValidatorSchema('confirm_password'),
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

export const changePasswordValidator = validate(
  checkSchema(
    {
      current_password: {
        notEmpty: {
          errorMessage: getRequiredMessage('current_password'),
        },
        custom: {
          options: async (value: string, { req }) => {
            const { user_id } = (req as Request).decoded_authorization as TokenPayload;

            const user = await databaseService.users.findOne({
              _id: new ObjectId(user_id),
            });

            if (!user) {
              throw new BaseError({
                status: HttpStatus.NotFound,
                message: RESPONSE_MESSAGE.USER_NOT_FOUND,
              });
            }

            if (user.password !== hashPassword(value)) {
              throw new BaseError({
                status: HttpStatus.Unauthorized,
                message: RESPONSE_MESSAGE.INCORRECT_PASSWORD,
              });
            }

            return true;
          },
        },
        trim: true,
      },
      new_password: getPasswordValidatorSchema('new_password'),
    },
    ['body'],
  ),
);
