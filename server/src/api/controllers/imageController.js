import multer from 'multer';
import sharp from 'sharp';
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
  const date = new Date(unixTimestamp * 1000); // convert seconds to ms
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
          // --- Initialize imageInfo with fallback/default values
          let imageInfo = {
            filename: file.originalname,
            geolocation: null,
            dateTaken: null,
            dateUploaded: formatToReadableAutoTZ(new Date()),
            locationName: null,
            exifData: null,
          };

          // --- Try extracting EXIF data
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

     
          const compressedBuffer = await sharp(file.buffer)
            .resize({ width: 1024 })
            .jpeg({ quality: 80 })
            .toBuffer();

     
          let exifString = JSON.stringify(imageInfo);
        

          const saved = await UploadedImage.query().insert({
            filename: file.originalname,
            mime_type: file.mimetype,
            image_data: compressedBuffer,
            user_id: req.user?.id ?? null,
            image_exif_data: exifString,
          });

          return saved;
        })
      );

      res.status(201).json({
        message: 'Images uploaded and saved.',
        data: savedImages.map((img) => ({
          id: img.id,
          filename: img.filename,
        })),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Upload failed' });
    }
  },
];
