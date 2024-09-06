import { NextFunction, Request, Response } from 'express';
import { ValidationChain } from 'express-validator';
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema';

import HTTP_STATUS from '@/constants/http-status';

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const [result] = await validation.run(req);

    if (!result.isEmpty()) {
      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({ errors: result.mapped() });
    }

    next();
  };
};
