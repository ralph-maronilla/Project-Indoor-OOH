import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import CustomDialog from '../Admin/popups components/CustomDialog';

const AllImageTable = ({ data }) => {
  const theme = useTheme();
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openRewardsDialog, setOpenRewardsDialog] = useState(false);
  const [openRewardDetailsDialog, setOpenRewardDetailsDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  const handleOpenLightbox = useCallback((src) => {
    setSelectedImage(src);
    setOpenLightbox(true);
  }, []);

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

  useEffect(() => {
    console.log('image data', data);
  }, []);

  const handleOpenRewardDialog = useCallback((reward) => {
    setSelectedReward(reward);
    setOpenRewardDetailsDialog(true);
  }, []);

  const handleCloseRewardDialog = () => {
    setOpenRewardDetailsDialog(false);
    setSelectedReward(null);
  };
  const handleLightboxClick = useCallback(
    (value) => () => {
      handleOpenLightbox(value);
    },
    [handleOpenLightbox]
  );
  const rows = useMemo(() => {
    return data?.map((item, index) => ({
      id: item.images.id || index,
      user: item.user,
      filename: item?.images?.[0].filename || 'N/A',
      image: item?.images?.[0].imageBase64 || 'N/A',
      latitude: item?.images?.[0].latitude || 'N/A',
      longitude: item?.images?.[0].longitude || 'N/A',
      locationName: item?.images?.[0].locationName || 'Unknown',
      isApproved: item.isApproved,
      isRewarded: item.isRewarded,
      rewardAmount: `₱${item?.reward_details?.rewardAmount || 0}`,

      reward_details: item?.reward_details,
      date_rewarded: item?.reward_details?.createdAt
        ? new Date(item?.reward_details?.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
        : 'N/A',
    }));
  }, [data]);
  const columns = useMemo(() => {
    return [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'filename', headerName: 'Filename', width: 130 },
      {
        field: 'image',
        headerName: 'Image',
        width: 120,
        renderCell: (params) => {
          if (!params.value) return 'No Image';
          return (
            <Avatar
              variant='square'
              src={params.value}
              alt='Uploaded'
              sx={{
                width: 60,
                height: 60,
                cursor: 'pointer',
                border: '1px solid #ccc',
              }}
              onClick={handleLightboxClick(params.value)}
            />
          );
        },
      },
      { field: 'latitude', headerName: 'Latitude', width: 130 },
      { field: 'longitude', headerName: 'Longitude', width: 130 },
      { field: 'locationName', headerName: 'Location', width: 160 },
      {
        field: 'isApproved',
        headerName: 'Approved',
        width: 120,
        renderCell: (params) => (
          <Chip
            label={params.value === 1 ? 'Approved' : 'Not Approved'}
            //onClick={() => handleOpenRewardDialog(params.row)}
            color={params.value === 1 ? 'success' : 'error'}
          />
        ),
      },
      {
        field: 'date_rewarded',
        headerName: 'Date Rewarded',
        width: 150,
      },
      {
        field: 'rewardAmount',
        headerName: 'Reward Amount',
        width: 150,
      },
      {
        field: 'isRewarded',
        headerName: 'Rewarded',
        width: 120,
        renderCell: (params) => (
          <Chip
            label={params.value === 1 ? 'Rewarded' : 'Not Rewarded'}
            onClick={
              params.value !== 1
                ? null
                : () => handleOpenRewardDialog(params.row)
            }
            color={params.value === 1 ? 'success' : 'error'}
          />
        ),
      },
    ];
  }, [handleOpenRewardDialog, handleLightboxClick]);
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
      {/* Reward Details Dialog */}
      <CustomDialog
        open={openRewardDetailsDialog}
        onClose={handleCloseRewardDialog}
        title='Reward Details'
        maxWidth='sm'
        actions={<Button onClick={handleCloseRewardDialog}>Close</Button>}
      >
        {selectedReward ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: '100%' }}>
              <Typography>
                <strong>Email:</strong>{' '}
                {selectedReward.reward_details?.userEmail}
              </Typography>
              <Typography>
                <strong>Fullname:</strong>{' '}
                {selectedReward.reward_details?.userFullname}{' '}
              </Typography>

              <Typography>
                <strong>Mobile:</strong>{' '}
                {selectedReward?.reward_details.userMobilenumber}
              </Typography>

              <Typography>
                <strong>Rewarded:</strong>{' '}
                {selectedReward.isRewarded ? 'Yes' : 'No'}
              </Typography>
              <Typography>
                <strong>Reward Amount:</strong>{' '}
                {selectedReward?.reward_details?.rewardAmount}
              </Typography>
              <Typography>
                <strong>Reward Description:</strong>{' '}
                {selectedReward?.reward_details?.rewardDescription}
              </Typography>
              <Typography>
                <strong>Reference Number:</strong>{' '}
                {selectedReward?.reward_details?.rewardReferenceNumber}
              </Typography>
              <Divider />
              <Box sx={{ width: '100%' }}>
                <Typography variant='h6' sx={{ fontSize: '16px', marginY: 2 }}>
                  Reward Receipt:
                </Typography>
                {selectedReward?.reward_details && (
                  <Box
                    sx={{
                      display: 'flex',
                      // justifyContent: 'center',
                      // alignItems: 'center',
                      // backgroundColor: '#000',
                    }}
                  >
                    <img
                      src={selectedReward?.reward_details?.rewardReceipt}
                      alt='Preview'
                      style={{
                        maxWidth: '50%',
                        maxHeight: '100%',
                        borderRadius: '8px',
                      }}
                      onClick={() =>
                        handleOpenLightbox(
                          selectedReward?.reward_details?.rewardReceipt
                        )
                      }
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography>No reward details available.</Typography>
        )}
      </CustomDialog>
    </>
  );
};

export default AllImageTable;
