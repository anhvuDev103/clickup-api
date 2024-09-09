import { SignUpRequestBody } from '@/models/requests/user.requests';
import User from '@/models/schemas/User.shema';
import { generateOTP } from '@/utils/common';
import { hashPassword } from '@/utils/crypto';

import databaseService from './database.services';

class UserService {
  async signUp(payload: SignUpRequestBody) {
    //TODO: send OTP to user's email

    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        otp_code: generateOTP(4),
        password: hashPassword(payload.password),
      }),
    );

    return result;
  }

  async signIn() {}
}

const userService = new UserService();

export default userService;
