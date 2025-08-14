import express from 'express';
import { register, login,logout } from '../controllers/authController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // allow up to 10MB
});

router.post('/register', upload.single('image'),  register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
