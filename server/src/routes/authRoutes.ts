import express from 'express';
import { register ,login,logout , getMe,checkEmail,checkUsername} from '../controllers/auth.ts';
import { registerValidation ,loginValidation } from '../validators/userValidators.ts';
import validate from '../middleware/validate.ts';
import {authorize, protect} from "../middleware/auth.ts";

const router = express.Router();


router.get("/check-email", checkEmail);
router.get("/check-username", checkUsername);
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/logout', logout);
router.get('/me', protect,authorize('user'), getMe);

export default router;
