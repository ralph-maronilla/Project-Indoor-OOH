import React from 'react';
import CustomDialog from './CustomDialog';
import { Box } from '@mui/material';

const Lightboxdialog = ({ open, onClose, selectedImage }) => {
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth='lg' hideTitle>
      {selectedImage && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
          }}
        >
          <img
            src={selectedImage}
            alt='Preview'
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: '8px',
            }}
          />
        </Box>
      )}
    </CustomDialog>
  );
};

export default Lightboxdialog;
