import express from 'express';
import { getOoh, getOohById, createOoh, updateOoh, deleteOoh } from '../controllers/oohController.js';

const router = express.Router();

router.get('/', getOoh);
router.get('/:id', getOohById);
router.post('/', createOoh);
router.put('/:id', updateOoh);
router.delete('/:id', deleteOoh);

export default router;
