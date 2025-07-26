import { Request, Response, NextFunction } from 'express';
import { AuthUser } from './types/auth';

/**
 * Simple middleware to validate an incoming bearer token. The token is assumed
 * to be an Azure AD (MSAL) JWT. Only minimal structural checks are performed to
 * keep dependencies light. Production code should validate the token signature
 * using Microsoft-provided libraries or OpenID configuration.
 */
export function validateToken(req: Request, res: Response, next: NextFunction) {
  const auth = req.header('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }

  const token = auth.slice('Bearer '.length);
  const parts = token.split('.');
  if (parts.length !== 3) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return res.status(401).json({ error: 'Token expired' });
    }
    const user: AuthUser = {
      id: payload.oid || payload.sub,
      email: payload.preferred_username || payload.email || payload.upn,
    };
    (req as any).user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Unable to decode token' });
  }
}
