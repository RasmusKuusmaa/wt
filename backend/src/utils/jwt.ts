import jwt from 'jsonwebtoken';
import { AppError } from '../types/common.types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface JwtPayload {
    user_id: number;
    username: string;
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError(401, 'Token has expired');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new AppError(401, 'Invalid token');
        }
        throw new AppError(401, 'Authentication failed');
    }
};
