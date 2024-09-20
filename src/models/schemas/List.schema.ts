import { ObjectId } from 'mongodb';

type ListContructor = {
  _id?: ObjectId;

  name: string;
  is_private: boolean;
  parent_id?: ObjectId;
  member_ids: ObjectId[];

  created_at?: Date;
  updated_at?: Date;
};

class List {
  _id: ObjectId;

  name: string;
  is_private: boolean;
  parent_id: ObjectId | null;
  member_ids: ObjectId[];

  created_at: Date;
  updated_at: Date;

  constructor(payload: ListContructor) {
    const now = new Date();

    this._id = payload._id || new ObjectId();

    this.name = payload.name;
    this.is_private = payload.is_private;
    this.parent_id = payload.parent_id || null;
    this.member_ids = payload.member_ids;

    this.created_at = payload.created_at || now;
    this.updated_at = payload.updated_at || now;
  }
}

export default List;
