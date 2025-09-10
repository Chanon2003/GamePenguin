import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.token' });

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const JWT_SECRET = process.env.SECRET_KEY_ACCESS_TOKEN;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized: No token provided',
        error: true,
        success: false,
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Check if decoded payload has 'id' property
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
      return res.status(401).json({
        message: 'Unauthorized: Invalid token payload',
        error: true,
        success: false,
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized: Token verification failed',
      error: true,
      success: false,
    });
  }
};

export const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user; // type: JwtPayload | undefined

    console.log("user:", user);

    if (!user || user.role !== "Admin") {
      return res.status(401).json({
        message: "Unauthorized: Invalid token payload",
        error: true,
        success: false,
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Token verification failed",
      error: true,
      success: false,
    });
  }
};




