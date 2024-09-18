import { ObjectId, WithId } from 'mongodb';

import { HttpStatus } from '@/constants/enums';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { BaseError } from '@/models/Errors.model';
import { CreateWorkspaceRequestBody } from '@/models/requests/workspaces.requests';
import { GetWorkspaceResponse } from '@/models/responses/workspaces.responses';
import Workspace from '@/models/schemas/Workspace.schema';
import { getWorkspaceAggregate } from '@/utils/aggregates';

import databaseService from './database.services';

class WorkspacesService {
  /**========================================================================================================================
   * Get workspace by workspace_id.
   *
   * @param {string} user_id - The id of user.
   * @param {string} workspace_id - The id of workspace.
   *
   * @returns {Promise<GetWorkspaceResponse>} - A promise that resolves with the profile infomation if successful.
   *
   * @throws {Error} if any database side errors occur.
   */

  async getWorkspace(user_id: string, workspace_id: string): Promise<GetWorkspaceResponse> {
    const [workspace] = await databaseService.workspaces
      .aggregate<GetWorkspaceResponse>(getWorkspaceAggregate(user_id, workspace_id))
      .toArray();

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
   * @param {Array} payload.member_emails - The emails of the space members, provided by the user.
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

const workspacesService = new WorkspacesService();

export default workspacesService;
