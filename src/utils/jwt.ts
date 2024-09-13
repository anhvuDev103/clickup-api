import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

import { TokenType } from '@/constants/enums';

export interface TokenPayload extends JwtPayload {
  user_id: string;
  token_type: TokenType;
  iat: number;
  exp: number;
}

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

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: Secret }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) {
        reject(err);
      }

      resolve(decoded as TokenPayload);
    });
  });
};
