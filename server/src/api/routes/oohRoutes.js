import express from 'express';
import { 
    getOoh, getOohById, createOoh, 
    updateOoh, deleteOoh,getOohDropdowns,
  getOohDropdownsByCategory, 
  getOohDropdownById, 
  createOohDropdown, 
  deleteOohDropdown 
} from '../controllers/oohController.js';

const router = express.Router();

router.get('/dropdowns', getOohDropdowns);
router.get('/dropdowns/category/:category', getOohDropdownsByCategory);
router.get('/dropdowns/:id', getOohDropdownById);
router.post('/dropdowns', createOohDropdown);
router.delete('/dropdowns/:id', deleteOohDropdown);

router.get('/', getOoh);

router.get('/:id', getOohById);
router.post('/', createOoh);
router.put('/:id', updateOoh);
router.delete('/:id', deleteOoh);



export default router;
