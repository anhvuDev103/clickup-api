import { ObjectId } from 'mongodb';

export function generateOTP(limit = 4) {
  const digits = '0123456789';
  let OTP = '';

  for (let i = 0; i < limit; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
}

export function transformStringToObjectId(obj: Record<string, unknown>): Record<string, unknown> {
  const transformedObj = Object.entries(obj).map(([key, value]) => {
    if (typeof value === 'string' && ObjectId.isValid(value)) {
      return [key, new ObjectId(value)];
    }

    return [key, value];
  });

  return Object.fromEntries(transformedObj);
}
