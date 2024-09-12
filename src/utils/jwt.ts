import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export const signToken = ({
  payload,
  secretOrPrivateKey,
  options,
}: {
  payload: string | Buffer | object;
  secretOrPrivateKey: Secret;
  options?: SignOptions;
}) => {
  const mergedOptions: SignOptions = {
    algorithm: 'HS256',
    ...options,
  };

  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, mergedOptions, (err, token) => {
      if (err) {
        reject(err);
      }

      resolve(token as string);
    });
  });
};
