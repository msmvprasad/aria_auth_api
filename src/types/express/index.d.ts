import type { AuthUser } from '../auth';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {}; // ensure this file is a module
