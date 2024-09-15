import HTTP_STATUS from '@/constants/http-status';
import { RESPONSE_MESSAGE } from '@/constants/messages';

type BaseResponseContructor = {
  status?: number;
  message?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: Record<string, any>;
};

export class BaseResponse {
  status: number;
  message: string;

  result?: Record<string, unknown>;

  constructor(payload?: BaseResponseContructor) {
    const _payload = payload || {
      status: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGE.SUCCESSFUL,
    };

    this.status = _payload.status || HTTP_STATUS.OK;
    this.message = _payload.message || RESPONSE_MESSAGE.SUCCESSFUL;

    this.result = _payload.result;
  }
}
