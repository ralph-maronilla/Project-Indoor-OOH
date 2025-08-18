import multer from 'multer';
import UploadedImage from '../models/UploadedImage.js';
import SubmissionImage from '../models/SubmissionImage.js';
import Submission from '../models/Submission.js';
import exifParser from 'exif-parser';
import fetch from 'node-fetch';
import sharp from 'sharp';

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

// export const uploadImages = [
//   upload.array('images'),

//   async (req, res) => {
//     try {
//       const savedImages = await Promise.all(
//         req.files.map(async (file) => {
//           let imageInfo = {
//             filename: file.originalname,
//             geolocation: null,
//             dateTaken: null,
//             dateUploaded: formatToReadableAutoTZ(new Date()),
//             locationName: null,
//             exifData: null,
//           };

//           try {
//             const parser = exifParser.create(file.buffer);
//             const exifData = parser.parse();
//             const tags = exifData.tags;

//             imageInfo.exifData = Object.fromEntries(
//               Object.entries(tags).filter(
//                 ([_, v]) => typeof v !== 'object' && typeof v !== 'function'
//               )
//             );

//             if (tags.GPSLatitude && tags.GPSLongitude) {
//               const lat = tags.GPSLatitude;
//               const lon = tags.GPSLongitude;
//               imageInfo.geolocation = { lat, lon };
//               imageInfo.locationName = await reverseGeocode(lat, lon);
//             }

//             if (tags.DateTimeOriginal) {
//               imageInfo.dateTaken = formatToReadableUTC(tags.DateTimeOriginal);
//             }

//             console.log(`EXIF for ${file.originalname}:`, tags);
//             console.log(`Image info:`, imageInfo);
//           } catch (err) {
//             console.warn(`EXIF parse failed for ${file.originalname}:`, err.message);
//           }

//           const exifString = JSON.stringify(imageInfo);

//           const saved = await UploadedImage.query().insert({
//             filename: file.originalname,
//             mime_type: file.mimetype,
//             image_data: file.buffer,
//             user_id: req.user?.id ?? null,
//             image_exif_data: exifString,
//           });

//           return {
//             id: saved.id,
//             filename: saved.filename,
//             exif: imageInfo,
//             imageBase64: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
//           };
//         })
//       );
//       res.status(201).json({
//         message: 'Images uploaded and saved.',
//         data: savedImages,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Upload failed' });
//     }
//   },
// ];





// export const uploadSubmissionWithImages = [
//   upload.array('images'),

//   async (req, res) => {
//     try {
//       const { submitted_by } = req.body;

//       // 1. Loop through files first to check EXIF before saving anything
//       for (const file of req.files) {
//         let tags;
//         try {
//           const parser = exifParser.create(file.buffer);
//           const exifData = parser.parse();
//           tags = exifData.tags;
//         } catch (err) {
//           return res.status(400).json({
//             error: `No EXIF data found for ${file.originalname}. Submission not processed.`,
//           });
//         }

//         // If tags is empty or has no DateTimeOriginal/GPS data
//         if (!tags || Object.keys(tags).length === 0) {
//           return res.status(400).json({
//             error: `No EXIF data found for ${file.originalname}. Submission not processed.`,
//           });
//         }
//       }

//       // 2. Create submission first
//       const submission = await Submission.query().insert({
//         submitted_by: parseInt(submitted_by, 10) ?? null,
//         isApproved: false,
//       });

//       // 3. Process and save each image
//       const savedImages = await Promise.all(
//         req.files.map(async (file) => {
//           let imageInfo = {
//             filename: file.originalname,
//             geolocation: null,
//             dateTaken: null,
//             dateUploaded: formatToReadableAutoTZ(new Date()),
//             locationName: null,
//             exifData: null,
//           };

//           const parser = exifParser.create(file.buffer);
//           const exifData = parser.parse();
//           const tags = exifData.tags;

//           imageInfo.exifData = Object.fromEntries(
//             Object.entries(tags).filter(
//               ([_, v]) => typeof v !== 'object' && typeof v !== 'function'
//             )
//           );

//           if (tags.GPSLatitude && tags.GPSLongitude) {
//             const lat = tags.GPSLatitude;
//             const lon = tags.GPSLongitude;
//             imageInfo.geolocation = { lat, lon };
//             imageInfo.locationName = await reverseGeocode(lat, lon);
//           }

//           if (tags.DateTimeOriginal) {
//             imageInfo.dateTaken = formatToReadableUTC(tags.DateTimeOriginal);
//           }

//           const exifString = JSON.stringify(imageInfo);

//           const saved = await UploadedImage.query().insert({
//             filename: file.originalname,
//             mime_type: file.mimetype,
//             image_data: file.buffer,
//             user_id: parseInt(submitted_by, 10) ?? null,
//             image_exif_data: exifString,
//           });

//           await SubmissionImage.query().insert({
//             submission_id: submission.id,
//             image_id: saved.id,
//           });

//           return {
//             id: saved.id,
//             filename: saved.filename,
//             exif: imageInfo,
//             imageBase64: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
//           };
//         })
//       );

//       res.status(201).json({
//         message: 'Submission and images uploaded successfully.',
//         submissionId: submission.id,
//         data: savedImages,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Upload failed' });
//     }
//   },
// ];




// export const uploadSubmissionWithImages = [
//   upload.array('images'),

//   async (req, res) => {
//     try {
//       const { submitted_by } = req.body;

//       // 1. Validate EXIF first
//       for (const file of req.files) {
//         let tags;
//         try {
//           const parser = exifParser.create(file.buffer);
//           const exifData = parser.parse();
//           tags = exifData.tags;
//         } catch (err) {
//           return res.status(400).json({
//             error: `No EXIF data found for ${file.originalname}. Submission not processed.`,
//           });
//         }

//         if (!tags || Object.keys(tags).length === 0) {
//           return res.status(400).json({
//             error: `No EXIF data found for ${file.originalname}. Submission not processed.`,
//           });
//         }
//       }

//       // 2. Create submission
//       const submission = await Submission.query().insert({
//         submitted_by: parseInt(submitted_by, 10) ?? null,
//         isApproved: false,
//       });

//       // 3. Process and save each image
//       const savedImages = await Promise.all(
//         req.files.map(async (file) => {
//           let imageInfo = {
//             filename: file.originalname,
//             geolocation: null,
//             dateTaken: null,
//             dateUploaded: formatToReadableAutoTZ(new Date()),
//             locationName: null,
//             exifData: null,
//           };

//           // Parse EXIF from original buffer
//           const parser = exifParser.create(file.buffer);
//           const exifData = parser.parse();
//           const tags = exifData.tags;

//           imageInfo.exifData = Object.fromEntries(
//             Object.entries(tags).filter(
//               ([_, v]) => typeof v !== 'object' && typeof v !== 'function'
//             )
//           );

//           if (tags.GPSLatitude && tags.GPSLongitude) {
//             const lat = tags.GPSLatitude;
//             const lon = tags.GPSLongitude;
//             imageInfo.geolocation = { lat, lon };
//             imageInfo.locationName = await reverseGeocode(lat, lon);
//           }

//           if (tags.DateTimeOriginal) {
//             imageInfo.dateTaken = formatToReadableUTC(tags.DateTimeOriginal);
//           }

//           const exifString = JSON.stringify(imageInfo);

//           // ✅ Compress to WebP (quality ~80, tweakable)
//           const compressedBuffer = await sharp(file.buffer)
//             .webp({ quality: 80 }) // retains most quality but smaller size
//             .toBuffer();

//           // Save compressed image
//           const saved = await UploadedImage.query().insert({
//             filename: file.originalname.replace(/\.[^/.]+$/, '') + '.webp', // replace extension
//             mime_type: 'image/webp',
//             image_data: compressedBuffer,
//             user_id: parseInt(submitted_by, 10) ?? null,
//             image_exif_data: exifString,
//           });

//           await SubmissionImage.query().insert({
//             submission_id: submission.id,
//             image_id: saved.id,
//           });

//           return {
//             id: saved.id,
//             filename: saved.filename,
//             exif: imageInfo,
//             imageBase64: `data:image/webp;base64,${compressedBuffer.toString('base64')}`,
//           };
//         })
//       );

//       res.status(201).json({
//         message: 'Submission and images uploaded successfully.',
//         submissionId: submission.id,
//         data: savedImages,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Upload failed' });
//     }
//   },
// ];


export const uploadSubmissionWithImages = [
  upload.array('images'),

  async (req, res) => {
    try {
      const { submitted_by } = req.body;

      // 1. Validate EXIF first
      for (const file of req.files) {
        let tags;
        try {
          const parser = exifParser.create(file.buffer);
          const exifData = parser.parse();
          tags = exifData.tags;
        } catch (err) {
          return res.status(400).json({
            error: `No EXIF data found for ${file.originalname}. Submission not processed.`,
          });
        }

        if (!tags || Object.keys(tags).length === 0) {
          return res.status(400).json({
            error: `No EXIF data found for ${file.originalname}. Submission not processed.`,
          });
        }
      }

      // 2. Create submission
      const submission = await Submission.query().insert({
        submitted_by: parseInt(submitted_by, 10) ?? null,
        isApproved: false,
      });

      // 3. Process and save each image
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

          // Parse EXIF from original buffer
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

          const exifString = JSON.stringify(imageInfo);

          // ✅ Compress to WebP and convert directly to base64 string
     const compressedBuffer = await sharp(file.buffer)
  .webp({ quality: 75, effort: 6 }) // balanced: smaller size, still sharp
  .toBuffer();

          const base64String = compressedBuffer.toString('base64');
          const dataUri = `data:image/webp;base64,${base64String}`;

          // Save base64 string directly in LONGTEXT column
          const saved = await UploadedImage.query().insert({
            filename: file.originalname.replace(/\.[^/.]+$/, '') + '.webp',
            mime_type: 'image/webp',
            image_data: base64String, // ✅ store base64 string directly
            user_id: parseInt(submitted_by, 10) ?? null,
            image_exif_data: exifString,
          });

          await SubmissionImage.query().insert({
            submission_id: submission.id,
            image_id: saved.id,
          });

          return {
            id: saved.id,
            filename: saved.filename,
            exif: imageInfo,
            imageBase64: dataUri,
          };
        })
      );

      res.status(201).json({
        message: 'Submission and images uploaded successfully.',
        submissionId: submission.id,
        data: savedImages,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Upload failed' });
    }
  },
];


export const getImagesByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const images = await UploadedImage.query().select(
      'id',
      'filename',
      'mime_type',
      'image_data',
      'image_exif_data'
    ).where('user_id', userId);

    const formatted = images.map(img => {
      let dataUri = null;

      if (img.imageData) {
        dataUri = `data:${img.mimeType};base64,${img.imageData}`;
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
        imageBase64: dataUri,
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


export const getImages = async (req, res) => {
  try {
    const images = await UploadedImage.query().select(
      'id',
      'filename',
      'mime_type',
      'image_data',
      'image_exif_data'
    );

    const formatted = images.map(img => {
      let dataUri = null;

      if (img.imageData) {
        dataUri = `data:${img.mimeType};base64,${img.imageData}`;
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
        imageBase64: dataUri,
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

