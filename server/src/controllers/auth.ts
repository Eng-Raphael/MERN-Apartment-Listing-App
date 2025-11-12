import asyncHandler from '../middleware/async.ts';
import User from '../models/User.ts';
import ErrorResponse from '../utils/errorResponse.ts';
import type { Request, Response, NextFunction } from 'express';
import  sendResponse  from '../utils/response.ts';

const sendTokenResponse = (user: any, statusCode: number, res: Response): void => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(
            Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE || '30', 10) * 24 * 60 * 60 * 1000)
        ),
        httpOnly: true,
    };

    res.status(statusCode).json({
        success: true,
        token,
    });
};


export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, username, email, password ,role} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorResponse('Email already registered', 400));
    }

    const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        password,
        role
    });

    return sendResponse(res, 201, 'User registered successfully', user);
});