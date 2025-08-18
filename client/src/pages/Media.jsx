import {
  Box,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useApiStore } from '../store/apiStore';
import { useMediaStore } from '../store/mediaStore';
import ImageDataTable from '../components/media/ImageDataTable';
import { useMutation } from '@tanstack/react-query';
import { useAppStateStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Media = () => {
  const theme = useTheme();
  const apiUrls = useApiStore((state) => state.apiUrls);
  const { uploadImages } = apiUrls;
  const { isLoading: storeLoading, setIsLoading } = useMediaStore();

  const { authUser } = useAppStateStore((state) => state);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageData, setImageData] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    console.log('Files selected:', files);
  };

  // Mutation function
  const uploadFiles = async (files) => {
    if (!files.length) throw new Error('No files selected');

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('submitted_by', authUser?.id);

    const response = await fetch(uploadImages, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data.error || `Upload failed with status ${response.status}`
      );
    }

    return data;
  };

  // React Query mutation
  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: uploadFiles,
    onMutate: () => {
      setIsLoading(true);
      toast.loading('Uploading image...', { id: 'upload-toast' }); // show loading toast
    },
    onSuccess: (data) => {
      setImageData(data?.data || []);
      console.log('Upload successful:', data);
      toast.success('Image uploaded successfully!', { id: 'upload-toast' });
    },
    onError: (err) => {
      console.error('Upload failed:', err.message);
      toast.error(`Upload failed: ${err.message}`, { id: 'upload-toast' });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleUpload = () => {
    mutate(selectedFiles);
  };

  return (
    <>
      {/* Loader */}
      <Box sx={{ width: '100%' }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={storeLoading}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </Box>

      {/* Upload Box */}
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
          <Button
            variant='contained'
            color='primary'
            onClick={handleUpload}
            disabled={isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
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

          {isError && (
            <Typography color='error' sx={{ mt: 2 }}>
              Error: {error.message}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Uploaded Images Table */}
      <Box sx={{ width: '70%', height: '500px' }}>
        {imageData.length > 0 && <ImageDataTable data={imageData} />}
      </Box>
    </>
  );
};

export default Media;
