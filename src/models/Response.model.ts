import HTTP_STATUS from '@/constants/http-status';

type BaseResponseContructor = {
  status?: number;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: Record<string, any>;
};

export class BaseResponse {
  status: number;
  message: string;
  result?: Record<string, unknown>;

  constructor(payload: BaseResponseContructor) {
    this.status = payload.status || HTTP_STATUS.OK;
    this.message = payload.message;
    this.result = payload.result;
  }
}
