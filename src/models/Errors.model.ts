import { ValidationError as ExpressValidationError } from 'express-validator';
import _ from 'lodash';

import HTTP_STATUS from '@/constants/http-status';

type BaseErrorContructor = {
  status: number;
  message: string;
};

type ValidationErrorContructor = {
  details: Record<string, ExpressValidationError>;
} & BaseErrorContructor;

export class BaseError {
  status: number;
  error: string;
  message: string;

  constructor(payload: BaseErrorContructor) {
    this.status = payload.status;
    this.error = _.findKey(HTTP_STATUS, (v) => v === payload.status) || 'unknown';
    this.message = payload.message;
  }
}

export class ValidationError extends BaseError {
  details: Record<string, ExpressValidationError>;

  constructor({ details, ...payload }: ValidationErrorContructor) {
    super(payload);
    this.details = details;
  }
}
