import express from 'express';
import { uploadSubmissionWithImages,getImages,getSubmissions } from '../controllers/imageController.js';

const router = express.Router();

router.post('/upload', uploadSubmissionWithImages);
router.get('/getImages', getImages);
router.get('/getSubmissions', getSubmissions);


export default router;
