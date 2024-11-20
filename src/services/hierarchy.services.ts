import { ObjectId } from 'mongodb';

import { ProjectHierarchyLevel } from '@/constants/enums';
import { CreateCategoryRequestBody, CreateProjectRequestBody } from '@/models/requests/hierarchy.requests';
import { GetHierarchyResponse } from '@/models/responses/hierarchy.responses';
import Category from '@/models/schemas/Category.schema';
import Project from '@/models/schemas/Project.schema';
import { generateGetHierarchyAggregate } from '@/utils/aggregates';

import databaseService from './database.services';

type CreateCategoryParams = { user_id: string; project_id: string; payload: CreateCategoryRequestBody };
type CreateSubCategoryParams = { user_id: string; parent_id: string; payload: CreateCategoryRequestBody };

class HierarchyService {
  /**========================================================================================================================
   * Get the hierarchy.
   *
   * @param {string} user_id - The id of user.
   * @param {string} workspace_id - The id of workspace.
   *
   * @returns {Promise<GetHierarchyResponse>} - Returns GetHierarchyResponse[].
   *
   * @throws {Error} if any database side errors occur.
   */

  async getHierarchy(user_id: string, workspace_id: string): Promise<GetHierarchyResponse[]> {
    const hierarchy = await databaseService.projects
      .aggregate<GetHierarchyResponse>(generateGetHierarchyAggregate(user_id, workspace_id))
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
   * @param {string} workspace_id - The id of workspace.
   *
   * @returns {Promise<void>} - Returns nothing.
   *
   * @throws {Error} if any database side errors occur.
   */

  async createProject(user_id: string, payload: CreateProjectRequestBody, workspace_id: string): Promise<void> {
    const member_ids = await databaseService.getUserIdByExistingEmails(payload.member_emails, {
      excludedEmail: user_id,
    });

    const { insertedId } = await databaseService.projects.insertOne(
      new Project({
        ...payload,
        owner_id: new ObjectId(user_id),
        workspace_id: new ObjectId(workspace_id),
        member_ids,
      }),
    );

    await this.createSubCategory({
      user_id,
      parent_id: insertedId.toString(),
      payload: {
        name: 'List',
        member_emails: [],
        is_private: false,
      },
    });
  }

  /**========================================================================================================================
   * Create new list from a space/folder.
   *
   * @param {string} user_id - The id of user.
   * @param {string} parent_id - The id of the space/folder.
   * @param {Object} payload - An object containing space create information.
   * @param {string} payload.name - The name space provided by the user.
   * @param {boolean} payload.is_private - The boolean represents a private space provided by the user.
   * @param {string} payload.parent_id - The id of the folder, provided by the user.
   *
   * @returns {Promise<void>} - Returns nothing.
   *
   * @throws {Error} if any database side errors occur.
   */

  async createSubCategory({ user_id, parent_id, payload }: CreateSubCategoryParams): Promise<void> {
    const member_ids = await databaseService.getUserIdByExistingEmails(payload.member_emails, {
      excludedEmail: user_id,
    });

    await databaseService.categories.insertOne(
      new Category({
        ...payload,
        parent_id: new ObjectId(parent_id),
        member_ids,
        hierarchy_level: ProjectHierarchyLevel.SubCategory,
      }),
    );
  }

  /**========================================================================================================================
   * Create new folder.
   *
   * @param {string} user_id - The id of user.
   * @param {string} project_id - The id of the project.
   * @param {Object} payload - An object containing space create information.
   * @param {string} payload.name - The name space provided by the user.
   * @param {boolean} payload.is_private - The boolean represents a private space provided by the user.
   * @param {string} payload.parent_id - The id of the space, provided by the user.
   *
   * @returns {Promise<void>} - Returns nothing.
   *
   * @throws {Error} if any database side errors occur.
   */

  async createCategory({ user_id, project_id, payload }: CreateCategoryParams): Promise<void> {
    const member_ids = await databaseService.getUserIdByExistingEmails(payload.member_emails, {
      excludedEmail: user_id,
    });

    const category_id = new ObjectId();

    await databaseService.categories.insertMany([
      new Category({
        ...payload,
        _id: category_id,
        parent_id: new ObjectId(project_id),
        member_ids,
        hierarchy_level: ProjectHierarchyLevel.Category,
      }),
      new Category({
        name: 'List',
        member_ids: [],
        parent_id: category_id,
        is_private: false,
        hierarchy_level: ProjectHierarchyLevel.SubCategory,
      }),
    ]);
  }
}

const hierarchyService = new HierarchyService();

export default hierarchyService;
