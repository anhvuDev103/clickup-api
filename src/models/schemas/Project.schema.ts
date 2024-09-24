import { ObjectId } from 'mongodb';

type ProjectContructor = {
  _id?: ObjectId;

  name: string;
  description?: string;
  is_private: boolean;
  owner_id: ObjectId;
  workspace_id: ObjectId;
  member_ids: ObjectId[];

  created_at?: Date;
  updated_at?: Date;
};

class Project {
  _id: ObjectId;

  name: string;
  description: string;
  is_private: boolean;
  owner_id: ObjectId;
  workspace_id: ObjectId;
  member_ids: ObjectId[];

  created_at: Date;
  updated_at: Date;

  constructor(payload: ProjectContructor) {
    const now = new Date();

    this._id = payload._id || new ObjectId();

    this.name = payload.name;
    this.description = payload.description || '';
    this.is_private = payload.is_private;
    this.owner_id = payload.owner_id;
    this.workspace_id = payload.workspace_id;
    this.member_ids = payload.member_ids;

    this.created_at = payload.created_at || now;
    this.updated_at = payload.updated_at || now;
  }
}

export default Project;
