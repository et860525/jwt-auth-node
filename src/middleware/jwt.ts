import jwt, { SignOptions } from 'jsonwebtoken';

const accessTokenPrivateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const accessTokenPublicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY;

export function signJwt(payload: Object, options: SignOptions) {
  if (!accessTokenPrivateKey) return null;
  const privateKey = Buffer.from(accessTokenPrivateKey, 'base64').toString(
    'ascii'
  );
  return jwt.sign(payload, privateKey, {
    ...options,
    algorithm: 'RS256',
    allowInsecureKeySizes: true,
  });
}

export function verifyJwt<T>(token: string): T | null {
  try {
    if (!accessTokenPublicKey) return null;
    const publicKey = Buffer.from(accessTokenPublicKey, 'base64').toString(
      'ascii'
    );
    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    console.log(error);
    return null;
  }
}
