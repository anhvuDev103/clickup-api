import { ParamsDictionary } from 'express-serve-static-core';

export interface GetHierarchyRequestBody {
  workspace_id: string;
}

export interface CreateSpaceRequestBody {
  name: string;
  description: string;
  is_private: boolean;
  member_emails: string[];
  workspace_id: string;
}

export interface CreateSubCategoryRequestBody {
  name: string;
  is_private: boolean;
  member_emails: string[];
}

export interface CreateCategoryRequestBody {
  name: string;
  is_private: boolean;
  member_emails: string[];
}

export interface CreateSubCategoryRequestParams extends ParamsDictionary {
  space_id: string;
}

export interface CreateCategoryRequestParams extends ParamsDictionary {
  space_id: string;
}
