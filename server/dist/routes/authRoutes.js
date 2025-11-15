import express from 'express';
import { register, login, logout, getMe, checkEmail, checkUsername } from '../controllers/auth.js';
import { registerValidation, loginValidation } from '../validators/userValidators.js';
import validate from '../middleware/validate.js';
import { authorize, protect } from "../middleware/auth.js";
const router = express.Router();
router.get("/check-email", checkEmail);
router.get("/check-username", checkUsername);
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/logout', logout);
router.get('/me', protect, authorize('user'), getMe);
export default router;
//# sourceMappingURL=authRoutes.js.map