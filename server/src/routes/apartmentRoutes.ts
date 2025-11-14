import express from 'express';
import upload from '../middleware/upload.ts';
import { createApartment , getApartments ,getApartment , checkReferenceNo , searchApartments} from '../controllers/apartmentController.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();


router.get('/search', searchApartments);
router.get("/check-reference", checkReferenceNo);
router.get('/', getApartments);
router.get('/:id', getApartment);
router.post('/create', protect, upload.array('images', 7), createApartment);
router.get("/check-reference", checkReferenceNo);

export default router;
