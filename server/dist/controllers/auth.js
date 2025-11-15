import asyncHandler from '../middleware/async.js';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import sendResponse from '../utils/response.js';
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE || '30', 10) * 24 * 60 * 60 * 1000)),
        httpOnly: true,
    };
    res.status(statusCode).json({
        success: true,
        token,
    });
};
export const register = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, username, email, password, role } = req.body;
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
export const login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('+password');
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
export const logout = asyncHandler(async (req, res, next) => {
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
export const getMe = asyncHandler(async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return next(new ErrorResponse('Unauthorized access – please log in', 401));
        }
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }
        res.status(200).json({
            success: true,
            message: 'User data retrieved successfully',
            data: user,
        });
    }
    catch (err) {
        next(new ErrorResponse('Unauthorized access – please log in', 401));
    }
});
export const checkEmail = asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }
    const exists = await User.findOne({ email });
    return res.status(200).json({
        success: true,
        exists: !!exists,
    });
});
export const checkUsername = asyncHandler(async (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required" });
    }
    const exists = await User.findOne({ username });
    return res.status(200).json({
        success: true,
        exists: !!exists,
    });
});
//# sourceMappingURL=auth.js.map