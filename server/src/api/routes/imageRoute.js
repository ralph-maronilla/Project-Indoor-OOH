import express from 'express';
import { uploadImages,getImages } from '../controllers/imageController.js';

const router = express.Router();

router.post('/upload', uploadImages);
router.get('/getImages', getImages);

export default router;
