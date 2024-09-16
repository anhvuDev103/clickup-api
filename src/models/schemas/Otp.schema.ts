import { ObjectId } from 'mongodb';
import ms from 'ms';

type OtpContructor = {
  _id?: ObjectId;

  code: string;
  email: string;
  expires_in: string;

  created_at?: Date;
};

class Otp {
  _id: ObjectId;

  code: string;
  email: string;
  expires_at: Date;

  created_at: Date;

  constructor(payload: OtpContructor) {
    const now = new Date();

    this._id = payload._id || new ObjectId();

    this.code = payload.code;
    this.email = payload.email;
    this.expires_at = new Date(now.valueOf() + ms(payload.expires_in));

    this.created_at = payload.created_at || now;
  }
}

export default Otp;
