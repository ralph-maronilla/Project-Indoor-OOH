
import multer from 'multer';
import sharp from 'sharp';
import UploadedImage from '../models/UploadedImage.js';

const upload = multer(); 

export const uploadImages = [
  upload.array('images'),

  async (req, res) => {
    try {
      const savedImages = await Promise.all(
        req.files.map(async (file) => {
          const compressedBuffer = await sharp(file.buffer)
            .resize({ width: 1024 })
            .jpeg({ quality: 80 })
            .toBuffer();

          const saved = await UploadedImage.query().insert({
            filename: file.originalname,
            mime_type: file.mimetype,
            image_data: compressedBuffer,
            user_id: req.user?.id ?? null,
          });

          return saved;
        })
      );

      res.status(201).json({
        message: 'Images uploaded and saved.',
        data: savedImages.map((img) => ({ id: img.id, filename: img.filename })),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Upload failed' });
    }
  },
];
