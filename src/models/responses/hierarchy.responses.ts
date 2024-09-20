import { SimpleUserProfileResponse } from './users.responses';

interface SimpleList {
  _id: string;
  name: string;
  is_private: boolean;
  sub_lists?: SimpleList;
}

export interface GetHierarchyResponse {
  _id: string;
  name: string;
  description: string;
  is_private: boolean;

  members: SimpleUserProfileResponse;
  lists: SimpleList;
}
