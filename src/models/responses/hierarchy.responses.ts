import { SimpleUserProfileResponse } from './users.responses';

interface SimpleCategory {
  _id: string;
  name: string;
  is_private: boolean;
  sub_categorys?: SimpleCategory;
}

export interface GetHierarchyResponse {
  _id: string;
  name: string;
  description: string;
  is_private: boolean;

  members: SimpleUserProfileResponse;
  categories: SimpleCategory;
}
