import pkg from 'jsonwebtoken';
const jwt = pkg;
type JwtPayload = pkg.JwtPayload;
import asyncHandler from './async.ts';
import ErrorResponse from '../utils/errorResponse.ts';
import User from '../models/User.ts';
import type { Request, Response, NextFunction } from 'express';


export interface AuthenticatedRequest extends Request {
    user?: any;
}


export const protect = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { id?: string };

        if (!decoded || !decoded.id) {
            return next(new ErrorResponse('Invalid token', 401));
        }

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        req.user = user;
        next();
    } catch (err) {
        next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

export const authorize =
    (...roles: string[]) =>
        (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (!req.user || !roles.includes(req.user.role)) {
                return next(
                    new ErrorResponse(
                        `User role ${req.user?.role} is not authorized to access this route`,
                        403
                    )
                );
            }
            next();
        };
