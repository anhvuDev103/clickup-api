import { Collection, Db, MongoClient } from 'mongodb';

import User from '@/models/schemas/User.shema';

const CONNECTION_UI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@clickup.nssxu.mongodb.net/?retryWrites=true&w=majority&appName=Clickup`;

class DatabaseService {
  private client: MongoClient;
  private db: Db;

  constructor() {
    this.client = new MongoClient(CONNECTION_UI);
    this.db = this.client.db(process.env.MONGO_DB_NAME);
  }

  async connect() {
    await this.client.connect();

    await this.db.command({ ping: 1 });
    console.log('You successfully connected to MongoDB!');
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.MONGO_USERS_COLLECTION_NAME as string);
  }
}

const databaseService = new DatabaseService();

export default databaseService;
