import express from 'express';
import { uploadImages } from '../controllers/imageController.js';

const router = express.Router();

router.post('/upload', uploadImages);

export default router;
