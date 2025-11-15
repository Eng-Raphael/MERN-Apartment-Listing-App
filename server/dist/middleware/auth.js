import pkg from 'jsonwebtoken';
const jwt = pkg;
import asyncHandler from './async.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
export const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return next(new ErrorResponse('Invalid token', 401));
        }
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }
        req.user = user;
        next();
    }
    catch (err) {
        next(new ErrorResponse('Not authorized to access this route', 401));
    }
});
export const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return next(new ErrorResponse(`User role ${req.user?.role} is not authorized to access this route`, 403));
    }
    next();
};
//# sourceMappingURL=auth.js.map