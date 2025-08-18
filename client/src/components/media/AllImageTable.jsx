import React, { useState } from 'react';
import { Box, Dialog, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';

const AllImageTable = ({ data }) => {
  const theme = useTheme();
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenLightbox = (src) => {
    setSelectedImage(src);
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
      const jsonString = atob(base64String);
      const bufferObj = JSON.parse(jsonString);

      if (bufferObj?.type === 'Buffer' && Array.isArray(bufferObj.data)) {
        const uint8Array = new Uint8Array(bufferObj.data);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
      }

      return dataUrl;
    } catch (e) {
      return dataUrl;
    }
  };

  const columns = data?.length
    ? Object.keys(data[0]).map((key) => {
        if (key === 'imageBase64') {
          return {
            field: key,
            headerName: 'Image',
            sortable: false,
            filterable: false,
            width: 100,
            renderCell: (params) => {
              const blobUrl = bufferBase64ToBlobUrl(params.value);
              return params.value ? (
                <img
                  src={blobUrl}
                  alt='Uploaded'
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleOpenLightbox(blobUrl)}
                />
              ) : (
                'No Image'
              );
            },
          };
        }

        return {
          field: key,
          headerName: key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^\w/, (c) => c.toUpperCase()),
          flex: 1,
        };
      })
    : [];

  const rows = data?.map((item, index) => ({
    id: item.id || index,
    ...item,
  }));

  return (
    <>
      <Box
        sx={{
          padding: 4,
          backgroundColor: theme.palette.background.default,
          borderRadius: '8px',
          boxShadow: 2,
          height: 600,
        }}
      >
        <Typography variant='h6' gutterBottom>
          Uploaded Images
        </Typography>
        <DataGrid
          rows={rows || []}
          columns={columns || []}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          sx={{
            '& .MuiDataGrid-cell': {
              textAlign: 'center',
            },
          }}
        />
      </Box>

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

export default AllImageTable;
