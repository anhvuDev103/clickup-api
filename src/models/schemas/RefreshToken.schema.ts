import { ObjectId } from 'mongodb';

type RefreshTokenConstructor = {
  _id?: ObjectId;
  token: string;
  user_id: ObjectId;
  iat: number;
  exp: number;
  created_at?: Date;
};

class RefreshToken {
  _id: ObjectId;
  token: string;
  user_id: ObjectId;
  iat: number;
  exp: number;
  created_at: Date;

  constructor(payload: RefreshTokenConstructor) {
    this._id = payload._id || new ObjectId();
    this.token = payload.token;
    this.user_id = payload.user_id;
    this.iat = payload.iat;
    this.exp = payload.exp;
    this.created_at = payload.created_at || new Date();
  }
}

export default RefreshToken;
