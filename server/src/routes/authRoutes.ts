import express from 'express';
import { register ,login,logout} from '../controllers/auth.ts';
import { registerValidation ,loginValidation } from '../validators/userValidators.ts';
import validate from '../middleware/validate.ts';

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/logout', logout);


export default router;
