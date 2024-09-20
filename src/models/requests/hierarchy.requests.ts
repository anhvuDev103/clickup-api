export interface CreateSpaceRequestBody {
  name: string;
  description: string;
  is_private: boolean;
  member_emails: string[];
  workspace_id: string;
}

export interface CreateListRequestBody {
  name: string;
  is_private: boolean;
  parent_id?: string;
  member_emails: string[];
}
