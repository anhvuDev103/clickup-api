import { ParamsDictionary } from 'express-serve-static-core';

export interface GetHierarchyRequestBody {
  workspace_id: string;
}

export interface CreateProjectRequestBody {
  name: string;
  description?: string;
  is_private: boolean;
  member_emails: string[];
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
  project_id: string;
  category_id: string;
}

export interface CreateCategoryRequestParams extends ParamsDictionary {
  project_id: string;
}
