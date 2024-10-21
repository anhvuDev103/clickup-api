import { TaskPriority, TaskStatus } from '@/constants/enums';

export interface CreateTaskRequestBody {
  name: string;
  assignees: string[];
  priority?: TaskPriority;
  status?: TaskStatus;
  projectId: string;
  categoryId: string;
  subcategoryId: string;
}
