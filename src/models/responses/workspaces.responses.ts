import { SimpleUserProfileResponse } from './users.responses';

export interface GetWorkspaceResponse {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
  owner: SimpleUserProfileResponse;
  members: SimpleUserProfileResponse[];
}
