export interface CreateSpaceRequestBody {
  name: string;
  description: string;
  is_private: boolean;
  member_emails: string[];
  workspace_id: string;
}
