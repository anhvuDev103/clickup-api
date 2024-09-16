import { DeleteResult, ObjectId } from 'mongodb';

import { TokenType } from '@/constants/enums';
import { SignUpRequestBody } from '@/models/requests/auth.requests';
import { SignInResponseResponse, SignUpResponseResponse } from '@/models/responses/auth.responses';
import RefreshToken from '@/models/schemas/RefreshToken.schema';
import User from '@/models/schemas/User.shema';
import { generateOTP } from '@/utils/common';
import { hashPassword } from '@/utils/crypto';
import { signToken, TokenPayload, verifyToken } from '@/utils/jwt';

import databaseService from './database.services';

class AuthService {
  /**========================================================================================================================
   * Generates a refresh token for a user.
   *
   * @param {string} user_id - The id of user.
   *
   * @returns {Promise<string>} - A signed refresh token.
   *
   * @throws {Error} if jwt sign token failed.
   */

  private async signRefreshToken(user_id: string): Promise<string> {
    const token = await signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
      },
      secretOrPrivateKey: process.env.REFRESH_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
      },
    });

    return token;
  }

  /**========================================================================================================================
   * Generates a access token for a user.
   *
   * @param {string} user_id - The id of user.
   *
   * @returns {Promise<string>} - A signed access token.
   *
   * @throws {Error} if jwt sign token failed.
   */

  private async signAccessToken(user_id: string): Promise<string> {
    const token = await signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
      },
      secretOrPrivateKey: process.env.ACCESS_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
      },
    });

    return token;
  }

  /**
   * ========================================================================================================================
   * Generates refresh token and access token for a user.
   *
   * @param {string} user_id - The id of user.
   *
   * @returns {Promise<[string, string]>} - Signed refresh token and access token.
   *
   * @throws {Error} if jwt sign token failed.
   */

  private async signRefreshAndAccessToken(user_id: string): Promise<[string, string]> {
    const tokens = await Promise.all([this.signRefreshToken(user_id), this.signAccessToken(user_id)]);

    return tokens;
  }

  /**
   * ========================================================================================================================
   * Decoded refresh token.
   *
   * @param {string} token - The token.
   *
   * @returns {Promise<TokenPayload>} - Decoded refresh token object.
   *
   * @throws {Error} if jwt verify token failed.
   */

  private async decodeRefreshToken(token: string): Promise<TokenPayload> {
    const decoded = await verifyToken({
      token,
      secretOrPublicKey: process.env.REFRESH_TOKEN_SECRET as string,
    });

    return decoded;
  }

  /**========================================================================================================================
   * Registers a new user in the system
   * & Generates refresh token and access token.
   *
   * @param {Object} payload - An object containing user sign-up information.
   * @param {string} payload.name - The name provided by the user.
   * @param {string} payload.email - The unique email address.
   * @param {string} payload.password - The user's password.
   *
   * @returns {Promise<SignUpResponseResponse>} - A promise that resolves with the created user object if successful.
   *
   * @throws {Error} if any database side errors occur.
   */

  async signUp(payload: SignUpRequestBody): Promise<SignUpResponseResponse> {
    //TODO: send OTP to user's email
    //TODO: Validate unique email on the database side
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        otp_code: generateOTP(4),
        password: hashPassword(payload.password),
      }),
    );

    const { insertedId } = result;
    const [refresh_token, access_token] = await this.signRefreshAndAccessToken(insertedId.toString());

    const decodedRefreshToken = await this.decodeRefreshToken(refresh_token);
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: insertedId,
        iat: decodedRefreshToken.iat,
        exp: decodedRefreshToken.exp,
      }),
    );

    return { refresh_token, access_token };
  }

  /**========================================================================================================================
   * Authenticates a user
   * & Generates refresh token and access token.
   *
   * @param {Object} payload - An object containing user sign-in information.
   * @param {string} payload.email - The email address provided by the user.
   * @param {string} payload.password - The password provided by the user.
   *
   * @returns {Promise<SignInResponseResponse>} - A promise that resolves with the created user object if successful.
   *
   * @throws {Error} if any database side errors occur.
   */

  async signIn(user_id: string): Promise<SignInResponseResponse> {
    const [refresh_token, access_token] = await this.signRefreshAndAccessToken(user_id);

    const decodedRefreshToken = await this.decodeRefreshToken(refresh_token);
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id),
        iat: decodedRefreshToken.iat,
        exp: decodedRefreshToken.exp,
      }),
    );

    return { refresh_token, access_token };
  }

  /**========================================================================================================================
   * Logs out the user
   * & Invalidating the refresh token.
   *
   * @param {string} user_id - The id of current user.
   * @param {string} refresh_token - The refresh token of user.
   *
   * @returns {Promise<void>} - No returns.
   *
   * @throws {Error} if any database side errors occur.
   */

  async logout(user_id: string, refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({
      token: refresh_token,
      user_id: new ObjectId(user_id),
    });
  }
}

const authService = new AuthService();

export default authService;
