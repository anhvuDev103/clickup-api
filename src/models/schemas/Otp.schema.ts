import { ObjectId } from 'mongodb';
import ms from 'ms';

type OtpContructor = {
  _id?: ObjectId;

  code: string;
  email: string;
  exp: string;
};

class Otp {
  _id: ObjectId;

  code: string;
  email: string;
  exp: Date;

  constructor(payload: OtpContructor) {
    const now = new Date().valueOf();

    this._id = payload._id || new ObjectId();

    this.code = payload.code;
    this.email = payload.email;
    this.exp = new Date(now + ms(payload.exp));
  }
}

export default Otp;
