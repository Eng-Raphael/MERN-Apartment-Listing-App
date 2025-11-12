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

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {username, password} = req.body;

    const user = await User.findOne({username}).select('+password');
    if (!user) {
        return next(new ErrorResponse(`Invalid credentials, user ${username} not found`, 401));
    }


    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials, incorrect password', 401));
    }


    const token = user.getSignedJwtToken();

    const cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRE || '30', 10);
    const cookieOptions = {
        expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res
        .status(200)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
});

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully',
        data: {},
    });
});