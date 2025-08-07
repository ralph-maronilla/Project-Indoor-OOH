import { Box, Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useApiStore } from '../store/apiStore';

const Media = () => {
  const theme = useTheme();
  const apiUrls = useApiStore((state) => state.apiUrls);
  const { uploadImages } = apiUrls;

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    console.log('Files selected:', files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('images', file); // Match the backend's expected field name
      });

      try {
        const response = await fetch(uploadImages, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Upload successful:', data);
      } catch (error) {
        console.error('Error during file upload:', error);
      }
    } else {
      alert('Please select files to upload');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#fff',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
          border: '2px dashed #ccc',
          borderRadius: '8px',
          width: '600px',
          backgroundColor: theme.palette.background.paper,
          //   opacity: 0.8,
          color: theme.palette.text.primary,
        }}
      >
        <Typography variant='h6' sx={{ mb: 2 }}>
          Upload Photos
        </Typography>
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={handleFileChange}
          style={{ marginBottom: '16px' }}
        />
        <Button variant='contained' color='primary' onClick={handleUpload}>
          Upload
        </Button>
        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant='body2' sx={{ mb: 1 }}>
              Selected Files:
            </Typography>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Media;
