import { ObjectId } from 'mongodb';

import { HttpStatus } from '@/constants/enums';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { BaseError } from '@/models/Errors.model';
import { GetProfileResponseResponse } from '@/models/responses/users.responses';

import databaseService from './database.services';

class UsersService {
  /**========================================================================================================================
   * Get user's profile.
   *
   * @param {user_id} user_id - The id of user.
   *
   * @returns {Promise<GetProfileResponseResponse>} - A promise that resolves with the profile infomation if successful.
   *
   * @throws {Error} if any database side errors occur.
   */
  async getProfile(user_id: string): Promise<GetProfileResponseResponse> {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          _id: 0,
          password: 0,
          refresh_token: 0,
          forgot_password_token: 0,
          created_at: 0,
          updated_at: 0,
        },
      },
    );

    if (!user) {
      throw new BaseError({
        status: HttpStatus.NotFound,
        message: RESPONSE_MESSAGE.USER_NOT_FOUND,
      });
    }

    return user;
  }
}

const usersService = new UsersService();

export default usersService;
