import * as jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'default_secret';

export function signToken(payload: Record<string, unknown>, expiresIn = '24h'): string {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyToken(token: string): Record<string, unknown> {
  return jwt.verify(token, SECRET) as Record<string, unknown>;
}
