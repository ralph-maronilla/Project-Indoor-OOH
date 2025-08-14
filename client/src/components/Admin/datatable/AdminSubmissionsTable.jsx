import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, Avatar, Dialog } from '@mui/material';

// Function to convert approval status to label + color
const getStatusChip = (isApproved) => {
  switch (isApproved) {
    case 1:
      return <Chip label='Approved' color='success' />;
    case -1:
      return <Chip label='Rejected' color='error' />;
    default:
      return <Chip label='Pending' color='warning' />;
  }
};

const AdminSubmissionsTable = ({ data }) => {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenLightbox = (src) => {
    setSelectedImage(src); // don't add data:image/jpeg;base64, again
    setOpenLightbox(true);
  };

  const handleCloseLightbox = () => {
    setOpenLightbox(false);
    setSelectedImage(null);
  };

  const bufferBase64ToBlobUrl = (dataUrl) => {
    if (!dataUrl) return '';

    const base64String = dataUrl.split(',')[1];

    try {
      // Try to parse as Buffer JSON
      const jsonString = atob(base64String);
      const bufferObj = JSON.parse(jsonString);

      if (bufferObj?.type === 'Buffer' && Array.isArray(bufferObj.data)) {
        const uint8Array = new Uint8Array(bufferObj.data);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
      }

      // If it's not a buffer object, treat it as raw image base64
      return dataUrl;
    } catch (e) {
      // If atob or JSON.parse fails, just return the original string
      return dataUrl;
    }
  };

  // Transform API data into DataGrid rows
  const rows = data.map((item) => {
    const img = item.images?.[0];
    return {
      id: item.id,
      filename: img?.filename || '',
      location: img?.exif?.locationName || 'N/A',
      dateTaken: img?.exif?.dateTaken || 'N/A',
      dateUploaded: img?.exif?.dateUploaded || 'N/A',
      imageBase64: img?.imageBase64 || '',
      status: item.isApproved,
    };
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'imageBase64',
      headerName: 'Image',
      width: 120,
      renderCell: (params) => {
        const blobUrl = bufferBase64ToBlobUrl(params.value);
        return (
          <Avatar
            variant='square'
            src={blobUrl}
            alt='Uploaded'
            sx={{
              width: 60,
              height: 60,
              cursor: 'pointer',
              border: '1px solid #ccc',
            }}
            onClick={() => handleOpenLightbox(blobUrl)}
          />
        );
      },
    },
    { field: 'filename', headerName: 'Filename', width: 200 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'dateTaken', headerName: 'Date Taken', width: 220 },
    { field: 'dateUploaded', headerName: 'Date Uploaded', width: 260 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => getStatusChip(params.value),
    },
  ];
  return (
    <>
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Box>
      {/* Lightbox Dialog */}
      <Dialog open={openLightbox} onClose={handleCloseLightbox} maxWidth='lg'>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt='Preview'
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: '8px',
              }}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default AdminSubmissionsTable;
// {
//     "id": 3,
//     "isApproved": 0,
//     "images": [
//         {
//             "id": 51,
//             "filename": "DSCN0012.jpg",
//             "exif": {
//                 "filename": "DSCN0012.jpg",
//                 "geolocation": {
//                     "lat": 43.46715666666389,
//                     "lon": 11.885394999997223
//                 },
//                 "dateTaken": "October 22, 2008 at 16:29:49 UTC",
//                 "dateUploaded": "August 13, 2025 at 05:16:24 PM (Asia/Manila)",
//                 "locationName": "Arezzo, Toscana, Italia",
//                 "exifData": {
//                     "ImageDescription": "                               ",
//                     "Make": "NIKON",
//                     "Model": "COOLPIX P6000",
//                     "Orientation": 1,
//                     "XResolution": 300,
//                     "YResolution": 300,
//                     "ResolutionUnit": 2,
//                     "Software": "Nikon Transfer 1.1 W",
//                     "ModifyDate": 1225574107,
//                     "YCbCrPositioning": 1,
//                     "GPSLatitudeRef": "N",
//                     "GPSLatitude": 43.46715666666389,
//                     "GPSLongitudeRef": "E",
//                     "GPSLongitude": 11.885394999997223,
//                     "GPSAltitudeRef": 0,
//                     "GPSSatellites": "06",
//                     "GPSImgDirectionRef": "",
//                     "GPSMapDatum": "WGS-84   ",
//                     "GPSDateStamp": "2008:10:23",
//                     "ExposureTime": 0.00560852,
//                     "FNumber": 4.5,
//                     "ExposureProgram": 2,
//                     "ISO": 64,
//                     "DateTimeOriginal": 1224692989,
//                     "CreateDate": 1224692989,
//                     "ExposureCompensation": 0,
//                     "MaxApertureValue": 2.9,
//                     "MeteringMode": 5,
//                     "LightSource": 0,
//                     "Flash": 16,
//                     "FocalLength": 6,
//                     "ColorSpace": 1,
//                     "ExifImageWidth": 640,
//                     "ExifImageHeight": 480,
//                     "CustomRendered": 0,
//                     "ExposureMode": 0,
//                     "WhiteBalance": 0,
//                     "DigitalZoomRatio": 0,
//                     "FocalLengthIn35mmFormat": 28,
//                     "SceneCaptureType": 0,
//                     "GainControl": 0,
//                     "Contrast": 0,
//                     "Saturation": 0,
//                     "Sharpness": 0,
//                     "SubjectDistanceRange": 0,
//                     "InteropIndex": "R98"
//                 }
//             },
//             "imageBase64": "base 64 string"
//         }
//     ]
// }
