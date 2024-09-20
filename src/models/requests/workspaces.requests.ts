import { ParamsDictionary } from 'express-serve-static-core';

export interface GetWorkspaceRequestParams extends ParamsDictionary {
  workspace_id: string;
}

export interface CreateWorkspaceRequestBody {
  name: string;
  member_emails: string[];
}
