import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { adminAuth } from '../lib/firebase-admin';

export interface DecodedUser {
  uid: string;
  email: string;
  role: string;
  name?: string;
  authType: 'custom' | 'firebase';
}

export interface AuthRequest extends Request {
  user?: DecodedUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'cropcare_vivasayam_secure_jwt_secret_2026';

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  
  // Try verifying as custom JWT first
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role || 'farmer',
      name: decoded.name,
      authType: 'custom',
    };
    return next();
  } catch (jwtErr) {
    // If custom JWT verification fails, attempt verifying with Firebase Admin SDK
    try {
      const decodedFirebase = await adminAuth.verifyIdToken(token);
      req.user = {
        uid: decodedFirebase.uid,
        email: decodedFirebase.email || '',
        role: (decodedFirebase.role as string) || 'farmer',
        name: decodedFirebase.name,
        authType: 'firebase',
      };
      return next();
    } catch (fbErr) {
      console.error('Auth verification failed:', { jwtErr: (jwtErr as Error).message, fbErr: (fbErr as Error).message });
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  }
};

// Role-based Access Control Middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
