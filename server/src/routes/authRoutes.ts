import express from 'express';
import { register } from '../controllers/auth.ts';
import { registerValidation } from '../validators/userValidators.ts';
import validate from '../middleware/validate.ts';

const router = express.Router();

router.post('/register', registerValidation, validate, register);

export default router;
