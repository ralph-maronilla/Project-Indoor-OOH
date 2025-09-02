import express from 'express';
import { getOoh } from '../controllers/oohController.js';

const router = express.Router();

router.get('/getOoh', getOoh);

export default router;
