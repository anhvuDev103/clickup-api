import { HttpStatus } from '@/constants/enums';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { BaseError } from '@/models/Errors.model';
import { GetProfileResponseResponse } from '@/models/responses/users.responses';
import { getProfileAggregate } from '@/utils/aggregates';

import databaseService from './database.services';

class UsersService {
  /**========================================================================================================================
   * Get user's profile.
   *
   * @param {string} user_id - The id of user.
   *
   * @returns {Promise<GetProfileResponseResponse>} - A promise that resolves with the profile infomation if successful.
   *
   * @throws {Error} if any database side errors occur.
   */

  async getProfile(user_id: string): Promise<GetProfileResponseResponse> {
    const [user] = await databaseService.users
      .aggregate<GetProfileResponseResponse>(getProfileAggregate(user_id))
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
