import { EmailStatusResponse } from '@/models/responses/verification.responses';

import databaseService from './database.services';

class VerificationService {
  /**
   * Get email's status.
   *
   * @param {string} email - The email address to check.
   *
   * @returns {Promise<EmailStatusResponse>} - A promise that resolves with the email's status if successful.
   *
   * @throws {Error} if any database side errors occur.
   */
  async getEmailStatus(email: string): Promise<EmailStatusResponse> {
    const existingUser = await databaseService.users.findOne({ email });

    const result: EmailStatusResponse = {
      email_taken: Boolean(existingUser),
    };

    return result;
  }
}

const verificationService = new VerificationService();

export default verificationService;
