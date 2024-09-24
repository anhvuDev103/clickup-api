import { Collection, Db, MongoClient, ObjectId } from 'mongodb';

import Category from '@/models/schemas/Category.schema';
import Otp from '@/models/schemas/Otp.schema';
import Project from '@/models/schemas/Project.schema';
import RefreshToken from '@/models/schemas/RefreshToken.schema';
import User from '@/models/schemas/User.schema';
import Workspace from '@/models/schemas/Workspace.schema';
import { logger } from '@/utils/logger';

const CONNECTION_UI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@clickup.nssxu.mongodb.net/?retryWrites=true&w=majority&appName=Clickup`;

class DatabaseService {
  private client: MongoClient;
  private db: Db;

  constructor() {
    this.client = new MongoClient(CONNECTION_UI);
    this.db = this.client.db(process.env.MONGO_DB_NAME);
  }

  /**
   * Index Actions
   */

  private async indexUser() {
    const isExists = await this.users.indexExists('email_1');

    if (!isExists) {
      const index = await this.users.createIndex({ email: 1 }, { unique: true });

      logger.mongoDb(`Index for ${index} field created successfully`);
    }
  }

  private async indexOtp() {
    const isExists = await this.otps.indexExists('expires_at_1');

    if (!isExists) {
      const index = await this.otps.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });

      logger.mongoDb(`Index for ${index} field created successfully`);
    }
  }

  async createIndexes() {
    await Promise.all([this.indexUser(), this.indexOtp()]);

    logger.mongoDb('All necessary indexes have been created');
  }

  /**
   * Connect
   */

  async connect() {
    await this.client.connect();

    await this.db.command({ ping: 1 });

    logger.mongoDb('Successfully connected to MongoDB!');
  }

  /**
   * Getters
   */

  get users(): Collection<User> {
    return this.db.collection(process.env.MONGO_USERS_COLLECTION_NAME as string);
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.MONGO_REFRESH_TOKENS_COLLECTION_NAME as string);
  }

  get otps(): Collection<Otp> {
    return this.db.collection(process.env.MONGO_OTP_COLLECTION_NAME as string);
  }

  get workspaces(): Collection<Workspace> {
    return this.db.collection(process.env.MONGO_WORKSPACES_COLLECTION_NAME as string);
  }

  get projects(): Collection<Project> {
    return this.db.collection(process.env.MONGO_PROJECTS_COLLECTION_NAME as string);
  }

  get categories(): Collection<Category> {
    return this.db.collection(process.env.MONGO_CATEGORIES_COLLECTION_NAME as string);
  }

  /**
   * Utils
   */

  async getUserIdByExistingEmails(emails: string[], options?: { excludedEmail: string }): Promise<ObjectId[]> {
    const { excludedEmail } = options || {};

    let user_ids: ObjectId[] = [];

    const users = await databaseService.users
      .find({
        email: {
          $in: emails,
        },
      })
      .toArray();

    user_ids = users.map((user) => user._id).filter((id) => !id.equals(excludedEmail));

    return user_ids;
  }
}

const databaseService = new DatabaseService();

export default databaseService;
