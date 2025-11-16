import express from 'express';
import upload from '../middleware/upload.js';
import { createApartment , getApartments ,getApartment , checkReferenceNo , searchApartments,getCompounds} from '../controllers/apartmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get("/compounds/list", getCompounds);
router.get('/search', searchApartments);
router.get("/check-reference", checkReferenceNo);
router.get('/', getApartments);
router.get('/:id', getApartment);
router.post('/create', protect, upload.array('images', 7), createApartment);


export default router;
