import { JwtPayload } from 'jsonwebtoken';

interface UserPayload {
  id: number;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}