import { ObjectId } from 'mongodb';

import { ProjectHierarchyLevel } from '@/constants/enums';

type CategoryContructor = {
  _id?: ObjectId;

  name: string;
  is_private: boolean;
  parent_id: ObjectId;
  member_ids: ObjectId[];
  hierarchy_level: ProjectHierarchyLevel;

  created_at?: Date;
  updated_at?: Date;
};

class Category {
  _id: ObjectId;

  name: string;
  is_private: boolean;
  parent_id: ObjectId | null;
  member_ids: ObjectId[];
  hierarchy_level: ProjectHierarchyLevel;

  created_at: Date;
  updated_at: Date;

  constructor(payload: CategoryContructor) {
    const now = new Date();

    this._id = payload._id || new ObjectId();

    this.name = payload.name;
    this.is_private = payload.is_private;
    this.parent_id = payload.parent_id;
    this.member_ids = payload.member_ids;
    this.hierarchy_level = payload.hierarchy_level;

    this.created_at = payload.created_at || now;
    this.updated_at = payload.updated_at || now;
  }
}

export default Category;
