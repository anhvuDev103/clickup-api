import { ObjectId, WithId } from 'mongodb';

import { HttpStatus } from '@/constants/enums';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { BaseError } from '@/models/Errors.model';
import { CreateWorkspaceRequestBody } from '@/models/requests/users.requests';
import { GetProfileResponseResponse } from '@/models/responses/users.responses';
import Workspace from '@/models/schemas/Workspace.schema';
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

  /**========================================================================================================================
   * Get workspace by workspace_id.
   *
   * @param {string} user_id - The id of user.
   * @param {string} workspace_id - The id of workspace.
   *
   * @returns {Promise<WithId<Workspace>>} - A promise that resolves with the profile infomation if successful.
   *
   * @throws {Error} if any database side errors occur.
   */
  async getWorkspace(user_id: string, workspace_id: string): Promise<WithId<Workspace>> {
    const objectUserId = new ObjectId(user_id);

    const workspace = await databaseService.workspaces.findOne({
      _id: new ObjectId(workspace_id),
      $or: [
        {
          member_ids: {
            $in: [objectUserId],
          },
        },
        {
          owner_id: objectUserId,
        },
      ],
    });

    if (!workspace) {
      throw new BaseError({
        status: HttpStatus.NotFound,
        message: RESPONSE_MESSAGE.WORKSPACE_NOT_FOUND,
      });
    }

    return workspace;
  }

  /**========================================================================================================================
   * Create new workspace.
   *
   * @param {user_id} user_id - The id of user.
   * @param {Object} payload - An object containing workspace create information.
   * @param {string} payload.name - The name workspace provided by the user.
   * @param {Array} payload.member_emails - The user's password.
   *
   * @returns {Promise<void>} - Returns nothing.
   *
   * @throws {Error} if any database side errors occur.
   */
  async createWorkspace(user_id: string, payload: CreateWorkspaceRequestBody): Promise<void> {
    const members = await databaseService.users
      .find({
        email: {
          $in: payload.member_emails,
        },
      })
      .toArray();

    const member_ids = members.map((member) => member._id).filter((id) => !id.equals(user_id));

    await databaseService.workspaces.insertOne(
      new Workspace({
        owner_id: new ObjectId(user_id),
        name: payload.name,
        member_ids,
      }),
    );
  }
}

const usersService = new UsersService();

export default usersService;
