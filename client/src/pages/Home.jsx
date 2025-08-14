import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { useState } from 'react';
import CardItem from '../components/dashboard/CardItem';
import ImageDataTable from '../components/media/ImageDataTable';
import { useApiStore } from '../store/apiStore';
import { useMediaStore } from '../store/mediaStore';
import AllImageTable from '../components/media/AllImageTable';

const Home = () => {
  const theme = useTheme();
  const apiUrls = useApiStore((state) => state.apiUrls);
  const { getAllImages } = apiUrls;
  const { isLoading, setIsLoading } = useMediaStore();

  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(getAllImages);
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        const transformedData = data?.data.map((item) => ({
          id: item?.id || 'N/A',
          filename: item?.filename || 'N/A',
          dateTaken: item?.exif?.dateTaken || 'N/A',
          dateUploaded: item?.exif?.dateUploaded || 'N/A',
          locationName: item?.exif?.locationName || 'Unknown',
          latitude: item?.exif?.geolocation?.lat || 'N/A',
          longitude: item?.exif?.geolocation?.lon || 'N/A',
        }));
        console.log(transformedData);
        setAllImages(transformedData);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllImages();
  }, []);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </Box>
      <Box
        sx={{
          width: `calc(100% - 240px)`,
          marginLeft: '240px',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          // justifyContent: 'center',
          // alignItems: 'center',
          height: '100vh',
          color: theme.palette.text.primary,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <CardItem name='Total Photos' value='100' />
          <CardItem name='Total Submissions' value='100' />
          <CardItem name='Total Rejected' value='100' />
        </Box>
        <Box sx={{ width: '100%', height: '500px', marginTop: '50px' }}>
          {getAllImages && <AllImageTable data={allImages} />}
        </Box>
      </Box>
    </>
  );
};

export default Home;

// {
//   "id": 28,
//   "filename": "DSCN0012.jpg",
//   "exif": {
//       "filename": "DSCN0012.jpg",
//       "geolocation": {
//           "lat": 43.46715666666389,
//           "lon": 11.885394999997223
//       },
//       "dateTaken": "October 22, 2008 at 16:29:49 UTC",
//       "dateUploaded": "June 19, 2025 at 03:16:31 PM (Asia/Manila)",
//       "locationName": "Arezzo, Toscana, Italia",
//       "exifData": {
//           "ImageDescription": "                               ",
//           "Make": "NIKON",
//           "Model": "COOLPIX P6000",
//           "Orientation": 1,
//           "XResolution": 300,
//           "YResolution": 300,
//           "ResolutionUnit": 2,
//           "Software": "Nikon Transfer 1.1 W",
//           "ModifyDate": 1225574107,
//           "YCbCrPositioning": 1,
//           "GPSLatitudeRef": "N",
//           "GPSLatitude": 43.46715666666389,
//           "GPSLongitudeRef": "E",
//           "GPSLongitude": 11.885394999997223,
//           "GPSAltitudeRef": 0,
//           "GPSSatellites": "06",
//           "GPSImgDirectionRef": "",
//           "GPSMapDatum": "WGS-84   ",
//           "GPSDateStamp": "2008:10:23",
//           "ExposureTime": 0.00560852,
//           "FNumber": 4.5,
//           "ExposureProgram": 2,
//           "ISO": 64,
//           "DateTimeOriginal": 1224692989,
//           "CreateDate": 1224692989,
//           "ExposureCompensation": 0,
//           "MaxApertureValue": 2.9,
//           "MeteringMode": 5,
//           "LightSource": 0,
//           "Flash": 16,
//           "FocalLength": 6,
//           "ColorSpace": 1,
//           "ExifImageWidth": 640,
//           "ExifImageHeight": 480,
//           "CustomRendered": 0,
//           "ExposureMode": 0,
//           "WhiteBalance": 0,
//           "DigitalZoomRatio": 0,
//           "FocalLengthIn35mmFormat": 28,
//           "SceneCaptureType": 0,
//           "GainControl": 0,
//           "Contrast": 0,
//           "Saturation": 0,
//           "Sharpness": 0,
//           "SubjectDistanceRange": 0,
//           "InteropIndex": "R98"
//       }
//   },
//   "imageBase64":""
// }
