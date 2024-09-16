import HTTP_STATUS from '@/constants/http-status';
import { RESPONSE_MESSAGE } from '@/constants/messages';
import { BaseError } from '@/models/Errors.model';
import { EmailStatusResponse } from '@/models/responses/verification.responses';
import Otp from '@/models/schemas/Otp.schema';
import { generateOTP } from '@/utils/common';

import databaseService from './database.services';

class VerificationService {
  /**========================================================================================================================
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

  /**========================================================================================================================
   * Send OTP code to email to verify the email.
   *
   * @param {string} email - The email address to check.
   *
   * @returns {Promise<void>} - Returns nothing.
   *
   * @throws {Error} if any database side errors occur.
   */
  async sendOtp(email: string): Promise<void> {
    const otp_code = new Otp({
      code: generateOTP(),
      email,
      expires_in: process.env.OTP_CODE_EXPIRES_IN as string,
    });

    //TODO: send OTP code to the email

    await databaseService.otps.updateOne(
      {
        email,
      },
      {
        $set: {
          code: otp_code.code,
          expires_at: otp_code.expires_at,
        },
      },
      {
        upsert: true,
      },
    );
  }

  /**========================================================================================================================
   * Verify the email with OTP code.
   *
   * @param {string} email - The email address to check.
   * @param {string} otp_code - The OTP provided by the user.
   *
   * @returns {Promise<void>} - Returns nothing.
   *
   * @throws {Error} if any database side errors occur.
   */
  async verifyEmail({ email, otp_code }: { email: string; otp_code: string }): Promise<void> {
    const result = await databaseService.otps.findOneAndDelete({
      email,
      code: otp_code,
    });

    if (!result) {
      throw new BaseError({
        status: HTTP_STATUS.NOT_FOUND,
        message: RESPONSE_MESSAGE.EMAIL_NOT_VERIFIED_YET,
      });
    }
  }
}

const verificationService = new VerificationService();

export default verificationService;
