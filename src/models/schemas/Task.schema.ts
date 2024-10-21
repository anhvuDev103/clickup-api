import { ObjectId } from 'mongodb';

import { TaskPriority, TaskStatus } from '@/constants/enums';

type TaskContructor = {
  _id?: ObjectId;

  name: string;
  assignees: ObjectId[];
  priority?: TaskPriority;
  status?: TaskStatus;

  project_id: ObjectId;
  category_id: ObjectId;
  subcategory_id: ObjectId;
};

class Task {
  _id: ObjectId;

  name: string;
  assignees: ObjectId[];
  priority: TaskPriority;
  status: TaskStatus;

  project_id: ObjectId;
  category_id: ObjectId;
  subcategory_id: ObjectId;

  constructor(payload: TaskContructor) {
    this._id = payload._id || new ObjectId();

    this.name = payload.name;
    this.assignees = payload.assignees;
    this.priority = payload.priority || TaskPriority.None;
    this.status = payload.status || TaskStatus.Todo;

    this.project_id = payload.project_id;
    this.category_id = payload.category_id;
    this.subcategory_id = payload.subcategory_id;
  }
}

export default Task;
