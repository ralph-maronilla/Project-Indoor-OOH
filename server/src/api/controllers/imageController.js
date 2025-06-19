import multer from 'multer';
import UploadedImage from '../models/UploadedImage.js';
import exifParser from 'exif-parser';
import fetch from 'node-fetch';

const upload = multer();

function formatToReadableAutoTZ(date) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return date.toLocaleString('en-US', {
    timeZone,
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }) + ` (${timeZone})`;
}

function formatToReadableUTC(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }) + ' UTC';
}

async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ImageUploader/1.0' },
    });
    const data = await res.json();
    return data.display_name || null;
  } catch (err) {
    console.warn('Reverse geocoding failed:', err.message);
    return null;
  }
}

export const uploadImages = [
  upload.array('images'),

  async (req, res) => {
    try {
      const savedImages = await Promise.all(
        req.files.map(async (file) => {
          let imageInfo = {
            filename: file.originalname,
            geolocation: null,
            dateTaken: null,
            dateUploaded: formatToReadableAutoTZ(new Date()),
            locationName: null,
            exifData: null,
          };

          try {
            const parser = exifParser.create(file.buffer);
            const exifData = parser.parse();
            const tags = exifData.tags;

            imageInfo.exifData = Object.fromEntries(
              Object.entries(tags).filter(
                ([_, v]) => typeof v !== 'object' && typeof v !== 'function'
              )
            );

            if (tags.GPSLatitude && tags.GPSLongitude) {
              const lat = tags.GPSLatitude;
              const lon = tags.GPSLongitude;
              imageInfo.geolocation = { lat, lon };
              imageInfo.locationName = await reverseGeocode(lat, lon);
            }

            if (tags.DateTimeOriginal) {
              imageInfo.dateTaken = formatToReadableUTC(tags.DateTimeOriginal);
            }

            console.log(`EXIF for ${file.originalname}:`, tags);
            console.log(`Image info:`, imageInfo);
          } catch (err) {
            console.warn(`EXIF parse failed for ${file.originalname}:`, err.message);
          }

          const exifString = JSON.stringify(imageInfo);

          const saved = await UploadedImage.query().insert({
            filename: file.originalname,
            mime_type: file.mimetype,
            image_data: file.buffer, // 🔥 No compression — use original buffer
            user_id: req.user?.id ?? null,
            image_exif_data: exifString,
          });

          return {
            id: saved.id,
            filename: saved.filename,
            exif: imageInfo,
            imageBase64: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          };
        })
      );

      res.status(201).json({
        message: 'Images uploaded and saved.',
        data: savedImages,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Upload failed' });
    }
  },
];

export const getImages = async (req, res) => {
    try {
      // Select required fields including the BLOB
      const images = await UploadedImage.query().select(
        'id',
        'filename',
        'mime_type',
        'image_data',
        'image_exif_data'
      );
  
      const formatted = images.map(img => {
        let base64 = null;
  
        if (img.imageData) {
          // Ensure it's a Node.js Buffer before converting to base64
          const buffer = Buffer.from(img.imageData);
          base64 = `data:${img.mimeType};base64,${buffer.toString('base64')}`;
        }
  
        let parsedExif = null;
        try {
          parsedExif = img.imageExifData ? JSON.parse(img.imageExifData) : null;
        } catch (parseErr) {
          console.warn(`Failed to parse EXIF for image ${img.id}:`, parseErr.message);
        }
  
        return {
          id: img.id,
          filename: img.filename,
          exif: parsedExif,
          imageBase64: base64,
        };
      });
  
      res.status(200).json({
        message: 'Images retrieved successfully.',
        data: formatted,
      });
  
    } catch (err) {
      console.error('Error fetching images:', err);
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  };
  