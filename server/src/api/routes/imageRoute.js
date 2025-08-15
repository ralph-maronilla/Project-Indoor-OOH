import express from 'express';
import { uploadSubmissionWithImages,getImages,getImagesByUserId } from '../controllers/imageController.js';

const router = express.Router();

router.post('/upload', uploadSubmissionWithImages);
router.get('/getImages', getImages);
router.get('/getImagesByUserId/:id', getImagesByUserId);


export default router;
