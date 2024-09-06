import { Request, Response } from 'express';

import { RESPONSE_MESSAGE } from '@/constants/messages';

export const signInController = (req: Request, res: Response) => {
  return res.json({
    message: RESPONSE_MESSAGE.SUCCESSFULLY_SIGNED_IN,
  });
};
