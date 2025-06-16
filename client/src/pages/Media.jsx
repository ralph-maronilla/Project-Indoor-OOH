import { Box, Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';

const Media = () => {
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    console.log('Files selected:', files);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      console.log('Uploading files:', selectedFiles);
      // Add your upload logic here
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
          backgroundColor: theme.palette.background.default,
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
