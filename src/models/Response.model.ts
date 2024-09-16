import { HttpStatus } from '@/constants/enums';
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
      status: HttpStatus.Ok,
      message: RESPONSE_MESSAGE.SUCCESSFUL,
    };

    this.status = _payload.status || HttpStatus.Ok;
    this.message = _payload.message || RESPONSE_MESSAGE.SUCCESSFUL;

    this.result = _payload.result;
  }
}
