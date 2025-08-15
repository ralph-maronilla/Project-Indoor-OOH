import express from 'express';
import {processSubmission, deleteSubmission, getSubmissions} from '../controllers/submissionController.js';
const router = express.Router();

router.post('/process', processSubmission);
router.delete('/delete/:submissionId', deleteSubmission);
router.get('/getSubmissions', getSubmissions);

export default router;