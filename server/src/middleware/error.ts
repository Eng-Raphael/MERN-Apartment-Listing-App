import type { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.ts';


interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    name: string;
    errors?: Record<string, { message: string }>;
}


const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    let error = { ...err };
    error.message = err.message;

    console.error('Error:', err);

    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new ErrorResponse(message, 404);
    }

    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }


    if (err.name === 'ValidationError' && err.errors) {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(', ');
        error = new ErrorResponse(message, 400);
    }

    const statusCode = (error as ErrorResponse).statusCode || 500;
    const message = error.message || 'Server Error';

    return res.status(statusCode).json({
        success: false,
        errors: [message],
    });
};

export default errorHandler;
