import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.ts';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'apartments',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            public_id: `apt_${Date.now()}_${file.originalname.split('.')[0]}`,
        };
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

export default upload;
