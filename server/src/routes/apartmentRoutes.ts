import express from 'express';
import upload from '../middleware/upload.ts';
import { createApartment , getApartments ,getApartment} from '../controllers/apartmentController.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

router.get('/', getApartments);
router.get('/:id', getApartment);
router.post('/create', protect, upload.array('images', 7), createApartment);

export default router;
