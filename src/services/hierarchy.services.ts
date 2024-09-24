import { ObjectId } from 'mongodb';

import { CreateCategoryRequestBody, CreateSpaceRequestBody } from '@/models/requests/hierarchy.requests';
import { GetHierarchyResponse } from '@/models/responses/hierarchy.responses';
import Category from '@/models/schemas/Category.schema';
import Space from '@/models/schemas/Space.schema';
import { generateGetHierachyAggregate } from '@/utils/aggregates';

import databaseService from './database.services';

type CreateCategoryParams = { user_id: string; space_id: string; payload: CreateCategoryRequestBody };

class HierarchyService {
  /**========================================================================================================================
   * Get the hierarchy.
   *
   * @param {string} user_id - The id of user.
   * @param {string} workspace_id - The emails of the space members, provided by the user.
   *
   * @returns {Promise<GetHierarchyResponse>} - Returns GetHierarchyResponse[].
   *
   * @throws {Error} if any database side errors occur.
   */

  async getHierarchy(user_id: string, workspace_id: string): Promise<GetHierarchyResponse[]> {
    const hierarchy = await databaseService.spaces
      .aggregate<GetHierarchyResponse>(generateGetHierachyAggregate(user_id, workspace_id))
      .toArray();

    return hierarchy;
  }

  /**========================================================================================================================
   * Create new space.
   *
   * @param {string} user_id - The id of user.
   * @param {Object} payload - An object containing space create information.
   * @param {string} payload.name - The name space provided by the user.
   * @param {string} payload.description - The description space provided by the user.
   * @param {boolean} payload.is_private - The boolean represents a private space provided by the user.
   * @param {Array} payload.member_emails - The emails of the space members, provided by the user.
   * @param {string} payload.workspace_id - The emails of the space members, provided by the user.
   *
   * @returns {Promise<void>} - Returns nothing.
   *
   * @throws {Error} if any database side errors occur.
   */

  async createSpace(user_id: string, payload: CreateSpaceRequestBody): Promise<void> {
    const member_ids = await databaseService.getUserIdByExistingEmails(payload.member_emails, {
      excludedEmail: user_id,
    });

    await databaseService.spaces.insertOne(
      new Space({
        ...payload,
        owner_id: new ObjectId(user_id),
        workspace_id: new ObjectId(payload.workspace_id),
        member_ids,
      }),
    );
  }

  /**========================================================================================================================
   * Create new list.
   *
   * @param {string} user_id - The id of user.
   * @param {Object} payload - An object containing space create information.
   * @param {string} payload.name - The name space provided by the user.
   * @param {boolean} payload.is_private - The boolean represents a private space provided by the user.
   * @param {string} payload.parent_id - The id of the folder, provided by the user.
   *
   * @returns {Promise<void>} - Returns nothing.
   *
   * @throws {Error} if any database side errors occur.
   */

  async createSubCategory({ user_id, space_id, payload }: CreateCategoryParams): Promise<void> {
    const member_ids = await databaseService.getUserIdByExistingEmails(payload.member_emails, {
      excludedEmail: user_id,
    });

    await databaseService.categories.insertOne(
      new Category({
        ...payload,
        parent_id: new ObjectId(space_id),
        member_ids,
      }),
    );
  }

  /**========================================================================================================================
   * Create new folder.
   *
   * @param {string} user_id - The id of user.
   * @param {Object} payload - An object containing space create information.
   * @param {string} payload.name - The name space provided by the user.
   * @param {boolean} payload.is_private - The boolean represents a private space provided by the user.
   * @param {string} payload.parent_id - The id of the space, provided by the user.
   *
   * @returns {Promise<void>} - Returns nothing.
   *
   * @throws {Error} if any database side errors occur.
   */

  async createCategory({ user_id, space_id, payload }: CreateCategoryParams): Promise<void> {
    const member_ids = await databaseService.getUserIdByExistingEmails(payload.member_emails, {
      excludedEmail: user_id,
    });

    const category_id = new ObjectId();

    await databaseService.categories.insertMany([
      new Category({
        ...payload,
        _id: category_id,
        parent_id: new ObjectId(space_id),
        member_ids,
      }),
      new Category({
        name: 'Category',
        member_ids: [],
        parent_id: category_id,
        is_private: false,
      }),
    ]);
  }
}

const hierarchyService = new HierarchyService();

export default hierarchyService;
