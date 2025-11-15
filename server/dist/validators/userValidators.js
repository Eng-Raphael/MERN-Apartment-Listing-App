import { body } from 'express-validator';
import User from '../models/User.js';
export const registerValidation = [
    body('firstName')
        .notEmpty().withMessage('Please add your first name')
        .isLength({ min: 2, max: 20 })
        .withMessage('First name should be between 2 to 20 alphabets'),
    body('lastName')
        .notEmpty().withMessage('Please add your last name')
        .isLength({ min: 2, max: 20 })
        .withMessage('Last name should be between 2 to 20 alphabets'),
    body('email')
        .notEmpty().withMessage('Please add an email')
        .isEmail().withMessage('Please add a valid email')
        .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
            throw new Error('Email already exists');
        }
        return true;
    }),
    body('password')
        .notEmpty().withMessage('Please add a password')
        .isLength({ min: 8 })
        .withMessage('Password should be at least 8 characters long'),
    body('username')
        .notEmpty().withMessage('Please add your username')
        .not()
        .isNumeric()
        .withMessage('Username cannot be a number')
        .custom(async (value) => {
        const user = await User.findOne({ username: value });
        if (user) {
            throw new Error('Username already exists');
        }
        return true;
    }),
];
export const loginValidation = [
    body('username')
        .notEmpty()
        .withMessage('Please provide a username')
        .not()
        .isNumeric()
        .withMessage('Username cannot be a number')
        .matches(/^[a-zA-Z0-9@_$%^&*!]+$/i)
        .withMessage('Please provide a valid username'),
    body('password')
        .notEmpty()
        .withMessage('Please add a password')
        .isLength({ min: 8 })
        .withMessage('Password should be at least 8 characters long'),
];
//# sourceMappingURL=userValidators.js.map