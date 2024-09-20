import { HttpStatus } from '@/constants/enums';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { BaseError } from '@/models/Errors.model';
import { SimpleUserProfileResponse } from '@/models/responses/users.responses';
import { generateGetProfileAggregate } from '@/utils/aggregates';

import databaseService from './database.services';

class UsersService {
  /**========================================================================================================================
   * Get user's profile.
   *
   * @param {string} user_id - The id of user.
   *
   * @returns {Promise<SimpleUserProfileResponse>} - A promise that resolves with the profile infomation if successful.
   *
   * @throws {Error} if any database side errors occur.
   */

  async getProfile(user_id: string): Promise<SimpleUserProfileResponse> {
    const [user] = await databaseService.users
      .aggregate<SimpleUserProfileResponse>(generateGetProfileAggregate(user_id))
      .toArray();

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
