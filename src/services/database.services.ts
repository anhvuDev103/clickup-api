import { Collection, Db, MongoClient } from 'mongodb';

import RefreshToken from '@/models/schemas/RefreshToken.schema';
import User from '@/models/schemas/User.shema';
import { logger } from '@/utils/logger';

const CONNECTION_UI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@clickup.nssxu.mongodb.net/?retryWrites=true&w=majority&appName=Clickup`;

class DatabaseService {
  private client: MongoClient;
  private db: Db;

  constructor() {
    this.client = new MongoClient(CONNECTION_UI);
    this.db = this.client.db(process.env.MONGO_DB_NAME);
  }

  private async indexUser() {
    const isExists = await this.users.indexExists('email_text');

    if (!isExists) {
      const index = await this.users.createIndex({ email: 'text' }, { unique: true });
      logger.mongoDb(`Index for ${index} field created successfully`);
    }
  }

  async connect() {
    await this.client.connect();

    await this.db.command({ ping: 1 });
    logger.mongoDb('Successfully connected to MongoDB!');
  }

  async createIndexes() {
    await Promise.all([this.indexUser()]);
    logger.mongoDb('All necessary indexes have been created');
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.MONGO_USERS_COLLECTION_NAME as string);
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.MONGO_REFRESH_TOKENS_COLLECTION_NAME as string);
  }
}

const databaseService = new DatabaseService();

export default databaseService;
