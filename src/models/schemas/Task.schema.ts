import { ObjectId } from 'mongodb';

import { TaskPriority, TaskStatus } from '@/constants/enums';

type TaskContructor = {
  _id?: ObjectId;

  name: string;
  assignees: ObjectId[];
  priority?: TaskPriority;
  status?: TaskStatus;

  projectId: ObjectId;
  categoryId: ObjectId;
  subcategoryId: ObjectId;
};

class Task {
  _id: ObjectId;

  name: string;
  assignees: ObjectId[];
  priority: TaskPriority;
  status: TaskStatus;

  projectId: ObjectId;
  categoryId: ObjectId;
  subcategoryId: ObjectId;

  constructor(payload: TaskContructor) {
    this._id = payload._id || new ObjectId();

    this.name = payload.name;
    this.assignees = payload.assignees;
    this.priority = payload.priority || TaskPriority.None;
    this.status = payload.status || TaskStatus.Todo;

    this.projectId = payload.projectId;
    this.categoryId = payload.categoryId;
    this.subcategoryId = payload.subcategoryId;
  }
}

export default Task;
