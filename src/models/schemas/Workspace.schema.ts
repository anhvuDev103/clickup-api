import { ObjectId } from 'mongodb';

type WorkspaceContructor = {
  _id?: ObjectId;

  name: string;
  owner_id: ObjectId;
  member_ids: ObjectId[];

  created_at?: Date;
  updated_at?: Date;
};

class Workspace {
  _id: ObjectId;

  name: string;
  owner_id: ObjectId;
  member_ids: ObjectId[];

  created_at: Date;
  updated_at: Date;

  constructor(payload: WorkspaceContructor) {
    const now = new Date();

    this._id = payload._id || new ObjectId();

    this.name = payload.name;
    this.owner_id = payload.owner_id;
    this.member_ids = payload.member_ids;

    this.created_at = payload.created_at || now;
    this.updated_at = payload.updated_at || now;
  }
}

export default Workspace;
