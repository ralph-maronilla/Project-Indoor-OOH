import express from 'express';
import {processSubmission, deleteSubmission, getSubmissions,submitRewardHistory,getRewardHistory} from '../controllers/submissionController.js';
import multer from 'multer';
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // allow up to 10MB
});
const router = express.Router();

router.post('/process', processSubmission);
router.delete('/delete/:submissionId', deleteSubmission);
router.get('/getSubmissions', getSubmissions);
router.post('/submitRewardHistory',upload.single('image'), submitRewardHistory);
router.get('/getRewardHistory', getRewardHistory);

export default router;