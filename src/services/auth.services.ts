import { InsertOneResult } from 'mongodb';

import { SignUpRequestBody } from '@/models/requests/auth.requests';
import User from '@/models/schemas/User.shema';
import { generateOTP } from '@/utils/common';
import { hashPassword } from '@/utils/crypto';

import databaseService from './database.services';

class AuthService {
  /**
   * Registers a new user in the system.
   *
   * @param {Object} payload - An object containing user sign-up information.
   * @param {string} payload.name - The name provided by the user.
   * @param {string} payload.email - The unique email address.
   * @param {string} payload.password - The user's password.
   *
   * @returns {Promise<InsertOneResult<User>>} - A promise that resolves with the created user object if successful.
   *
   * @throws {Error} if any database side errors occur.
   */
  async signUp(payload: SignUpRequestBody): Promise<InsertOneResult<User>> {
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

const authService = new AuthService();

export default authService;
