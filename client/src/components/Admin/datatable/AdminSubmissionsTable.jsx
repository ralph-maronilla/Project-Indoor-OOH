import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Chip,
  Avatar,
  Dialog,
  Select,
  MenuItem,
  Button,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import {
  handleSubmissionDelete,
  postStatusChanged,
} from '../../../helpers/postFunctions';
import toast from 'react-hot-toast';
import { useApiStore } from '../../../store/apiStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStateStore } from '../../../store/authStore';
import CustomDialog from '../popups components/CustomDialog';
import { useMediaStore } from '../../../store/mediaStore';
import RewardForms from '../Forms/RewardForms';

const AdminSubmissionsTable = ({ data, onStatusChange }) => {
  const authUser = useAppStateStore((state) => state.authUser);
  const setIsLoading = useMediaStore((state) => state.setIsLoading);

  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  const [openExifDialog, setOpenExifDialog] = useState(false);
  const [selectedExif, setSelectedExif] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openRewardsDialog, setOpenRewardsDialog] = useState(false);
  const [openRewardDetailsDialog, setOpenRewardDetailsDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  const { apiUrls } = useApiStore();
  const queryClient = useQueryClient();

  // Lightbox functions
  const handleOpenLightbox = (src) => {
    setSelectedImage(src);
    setOpenLightbox(true);
  };

  const handleCloseLightbox = () => {
    setOpenLightbox(false);
    setSelectedImage(null);
  };

  // Handle dropdown change
  const handleStatusSelect = (row, value) => {
    console.log('value', value);
    console.log('row', row);
    setSelectedRow(row);
    setNewStatus(value);
    setOpenDialog(true);
  };

  const handleConfirmChange = () => {
    if (selectedRow && newStatus) {
      changeStatus({ id: selectedRow.id, status: newStatus }); // 🔥 fire mutation
    }
    setOpenDialog(false);
    setSelectedRow(null);
    setNewStatus(null);
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setSelectedRow(null);
    setNewStatus(null);
  };
  const handleOpenExif = (exifData) => {
    setSelectedExif(exifData);
    setOpenExifDialog(true);
  };

  const handleCloseExif = () => {
    setSelectedExif(null);
    setOpenExifDialog(false);
  };
  // User details functions
  const handleOpenUserDialog = (user) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
  };
  const handleCloseUserDialog = () => {
    setSelectedUser(null);
    setOpenUserDialog(false);
  };

  // Transform API data
  const rows = data.map((item) => {
    const img = item.images?.[0];
    return {
      id: item.id,
      filename: img?.filename || '',
      location: img?.exif?.locationName || 'N/A',
      dateTaken: img?.exif?.dateTaken || 'N/A',
      dateUploaded: img?.exif?.dateUploaded || 'N/A',
      imageBase64: img?.imageBase64 || '',
      status: item.status, // 1, -1, 0
      exifData: img?.exif?.exifData || {},
      email: item?.submitted_by?.email,
      submitted_by: item?.submitted_by || {},
      isRewarded: item.isRewarded,
    };
  });

  // Columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'imageBase64',
      headerName: 'Image',
      width: 120,
      renderCell: (params) => {
        if (!params.value) return 'No Image';
        // console.log('params.value', params.value);

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
            onClick={() => handleOpenLightbox(params.value)}
          />
        );
      },
    },
    { field: 'filename', headerName: 'Filename', width: 200 },
    {
      field: 'email',
      headerName: 'Email',
      width: 220,
    },
    {
      field: 'user_details',
      headerName: 'User Details',
      width: 150,
      renderCell: (params) => (
        // <IconButton
        //   color='primary'
        //   size='small'
        //   onClick={() => handleOpenUserDialog(params.row.submitted_by)}
        // >
        <Button onClick={() => handleOpenUserDialog(params.row.submitted_by)}>
          View Details
        </Button>
        // </IconButton>
      ),
    },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'dateTaken', headerName: 'Date Taken', width: 220 },
    { field: 'dateUploaded', headerName: 'Date Uploaded', width: 260 },
    {
      field: 'exif',
      headerName: 'EXIF Data',
      width: 150,
      renderCell: (params) => (
        <Button
          variant='outlined'
          size='small'
          onClick={() => handleOpenExif(params.row.exifData)}
        >
          View EXIF
        </Button>
      ),
    },

    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.value}
          size='small'
          onChange={(e) => handleStatusSelect(params.row, e.target.value)}
          sx={{ width: '100%' }}
        >
          <MenuItem disabled={params.value === 'Denied'} value='Pending'>
            Pending
          </MenuItem>
          <MenuItem value='Approved'>Approved</MenuItem>
          <MenuItem value='Denied'>Denied</MenuItem>
        </Select>
      ),
    },
    {
      field: 'isRewarded',
      headerName: 'Rewarded',
      width: 150,
      renderCell: (params) => {
        // console.log('params.value', params.value);
        return (
          <Chip
            label={params.value === 1 ? 'Rewarded' : 'Not Rewarded'}
            onClick={() => handleOpenRewardDialog(params.row)}
            color={params.value === 1 ? 'success' : 'error'}
          />
        );
      },
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color='success'
            size='small'
            onClick={() => handleOpenRewards(params.row)}
            disabled={params.row.status !== 'Approved'}
          >
            <MonetizationOnIcon />
          </IconButton>
          <IconButton
            color='error'
            size='small'
            onClick={() => handleOpenDeleteDialog(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  //delete dialog
  // Open delete dialog
  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (deleteId) {
      await handleSubmissionDelete(`${apiUrls.deleteSubmission}`, deleteId);
      toast.success('Submission deleted successfully!');
      queryClient.invalidateQueries(['fetch-admin-submissions']);
    }
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  const { mutate: changeStatus, isLoading: isChanging } = useMutation({
    mutationFn: async ({ id, status }) => {
      setIsLoading(true);
      const payload = {
        submissionId: id,
        isApproved: status === 'Approved' ? 1 : 0,
        userId: authUser?.id,
      };
      console.log('payload', payload);
      return await postStatusChanged(
        `${apiUrls.postChangeSubmissionStatus}`,
        'POST',
        payload
      );
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries(['fetch-admin-submissions']),
        queryClient.invalidateQueries(['fetch-admin-rewards-submissions']),
      ]);

      setIsLoading(false);
      toast.success('Status updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update status');
    },
  });
  useEffect(() => {
    console.log('admin data', data);
  }, []);
  // open rewards dialog
  const handleOpenRewards = (submission) => {
    console.log(submission);
    setSelectedUser(submission);
    setOpenRewardsDialog(true);
  };

  const handleCloseRewards = () => {
    setOpenRewardsDialog(false);
  };
  const handleOpenRewardDialog = (reward) => {
    setSelectedReward(reward);
    setOpenRewardDetailsDialog(true);
  };

  const handleCloseRewardDialog = () => {
    setOpenRewardDetailsDialog(false);
    setSelectedReward(null);
  };

  return (
    <>
      {/* Data Table */}
      <Box
        sx={{
          height: 500,
          width: '100%',
          '& .row-rewarded': {
            backgroundColor: '#2f352fff', // light green
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          // getRowClassName={(params) =>
          //   params.row.isRewarded ? 'row-rewarded' : ''
          // }
        />
      </Box>

      {/* Lightbox */}
      <CustomDialog
        open={openLightbox}
        onClose={handleCloseLightbox}
        maxWidth='lg'
        hideTitle
      >
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

      {/* Confirmation Dialog */}
      <CustomDialog
        open={openDialog}
        onClose={handleCancel}
        title='Confirm Status Change'
        actions={
          <>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              onClick={handleConfirmChange}
              variant='contained'
              color='primary'
            >
              Confirm
            </Button>
          </>
        }
      >
        <Typography>
          Are you sure you want to change the status of{' '}
          <strong>ID {selectedRow?.id}</strong> to <strong>{newStatus}</strong>?
          <br />
          <br />
          {newStatus === 'Denied' && (
            <strong style={{ color: '#EE4B2B' }}>
              ⚠️ This is a permanent action and cannot be undone
            </strong>
          )}
        </Typography>
      </CustomDialog>

      {/* EXIF Data Dialog */}
      <CustomDialog
        open={openExifDialog}
        onClose={handleCloseExif}
        title='EXIF Data'
        maxWidth='md'
        actions={<Button onClick={handleCloseExif}>Close</Button>}
      >
        {selectedExif ? (
          <Table>
            <TableBody>
              {Object.entries(selectedExif).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>
                    <strong>{key}</strong>
                  </TableCell>
                  <TableCell>{String(value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No EXIF data available</Typography>
        )}
      </CustomDialog>

      {/* User Details Dialog */}
      <CustomDialog
        open={openUserDialog}
        onClose={handleCloseUserDialog}
        title='User Details'
        maxWidth='sm'
        actions={<Button onClick={handleCloseUserDialog}>Close</Button>}
      >
        {selectedUser ? (
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Box sx={{ width: '70%' }}>
              <Typography>
                <strong>Email:</strong> {selectedUser.email}
              </Typography>
              <Typography>
                <strong>First Name:</strong> {selectedUser.first_name}
              </Typography>
              <Typography>
                <strong>Last Name:</strong> {selectedUser.last_name}
              </Typography>
              <Typography>
                <strong>Mobile:</strong> {selectedUser.mobile_number}
              </Typography>
              <Typography>
                <strong>Role:</strong> {selectedUser.role}
              </Typography>
            </Box>
            <Box sx={{ width: '30%' }}>
              <Avatar
                variant='square'
                src={selectedUser.user_image}
                sx={{ width: 100, height: 100 }}
              />
            </Box>
          </Box>
        ) : (
          <Typography>No user details available.</Typography>
        )}
      </CustomDialog>

      {/* Delete Confirmation Dialog */}
      <CustomDialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        title='Confirm Deletion'
        actions={
          <>
            <Button onClick={handleCancelDelete}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              variant='contained'
              color='error'
            >
              Delete
            </Button>
          </>
        }
      >
        <Typography>
          Are you sure you want to delete submission{' '}
          <strong>ID {deleteId}</strong>? This action cannot be undone.
        </Typography>
      </CustomDialog>
      {/* Rewards Dialog */}
      <CustomDialog
        open={openRewardsDialog}
        onClose={handleCloseRewards}
        title='Rewards Submission'
        maxWidth='sm'
        actions={
          <>
            <Button onClick={handleCloseRewards}>Cancel</Button>
            {/* <Button
              onClick={handleRewardSubmission}
              variant='contained'
              color='success'
            >
              Submit Reward
            </Button> */}
          </>
        }
      >
        {selectedUser?.isRewarded == !1 ? (
          <RewardForms
            selectedUser={selectedUser}
            handleCloseRewards={handleCloseRewards}
          />
        ) : (
          <Typography>Submission has already been rewarded</Typography>
        )}
      </CustomDialog>
      {/* Reward Details Dialog */}
      <CustomDialog
        open={openRewardDetailsDialog}
        onClose={handleCloseRewardDialog}
        title='Reward Details'
        maxWidth='sm'
        actions={<Button onClick={handleCloseRewardDialog}>Close</Button>}
      >
        {selectedReward ? (
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Box sx={{ width: '70%' }}>
              <Typography>
                <strong>Email:</strong> {selectedReward.email}
              </Typography>
              <Typography>
                <strong>First Name:</strong> {selectedReward.first_name}
              </Typography>
              <Typography>
                <strong>Last Name:</strong> {selectedReward.last_name}
              </Typography>
              <Typography>
                <strong>Mobile:</strong> {selectedReward.mobile_number}
              </Typography>
              <Typography>
                <strong>Role:</strong> {selectedReward.role}
              </Typography>
              <Typography>
                <strong>Rewarded:</strong>{' '}
                {selectedReward.isRewarded ? 'Yes' : 'No'}
              </Typography>
            </Box>
            <Box sx={{ width: '30%' }}>
              <Avatar
                variant='square'
                src={selectedReward.user_image}
                sx={{ width: 100, height: 100 }}
              />
            </Box>
          </Box>
        ) : (
          <Typography>No reward details available.</Typography>
        )}
      </CustomDialog>
    </>
  );
};

export default AdminSubmissionsTable;

// {
//     "id": 1,
//     "isApproved": 0,
//     "images": [
//         {
//             "id": 1,
//             "filename": "IMG_4408.jpg",
//             "exif": {
//                 "filename": "IMG_4408.jpg",
//                 "geolocation": {
//                     "lat": 13.388988888888889,
//                     "lon": 121.18284722222222
//                 },
//                 "dateTaken": "August 14, 2025 at 09:28:38 UTC",
//                 "dateUploaded": "August 14, 2025 at 01:35:04 PM (Asia/Manila)",
//                 "locationName": "Calapan, Oriental Mindoro, Mimaropa, Philippines",
//                 "exifData": {
//                     "Make": "Apple",
//                     "Model": "iPhone 15 Pro Max",
//                     "Orientation": 6,
//                     "XResolution": 72,
//                     "YResolution": 72,
//                     "ResolutionUnit": 2,
//                     "Software": "18.5",
//                     "ModifyDate": 1755163718,
//                     "HostComputer": "iPhone 15 Pro Max",
//                     "GPSLatitudeRef": "N",
//                     "GPSLatitude": 13.388988888888889,
//                     "GPSLongitudeRef": "E",
//                     "GPSLongitude": 121.18284722222222,
//                     "GPSAltitudeRef": 0,
//                     "GPSAltitude": 5.478384019081694,
//                     "GPSSpeedRef": "K",
//                     "GPSSpeed": 0,
//                     "GPSImgDirectionRef": "T",
//                     "GPSImgDirection": 20.016628251564043,
//                     "GPSDestBearingRef": "T",
//                     "GPSDestBearing": 20.016628251564043,
//                     "GPSDateStamp": "2025:08:14",
//                     "GPSHPositioningError": 9.687959025898724,
//                     "ExposureTime": 0.025,
//                     "FNumber": 1.7799999713880652,
//                     "ExposureProgram": 2,
//                     "ISO": 1000,
//                     "DateTimeOriginal": 1755163718,
//                     "CreateDate": 1755163718,
//                     "undefined": "+08:00",
//                     "ShutterSpeedValue": 5.321524201853759,
//                     "ApertureValue": 1.6637544366004915,
//                     "BrightnessValue": -0.45888591485278524,
//                     "ExposureCompensation": 0.33539035466185535,
//                     "MeteringMode": 5,
//                     "Flash": 16,
//                     "FocalLength": 6.764999866370901,
//                     "SubSecTimeOriginal": "858",
//                     "SubSecTimeDigitized": "858",
//                     "ColorSpace": 65535,
//                     "ExifImageWidth": 5712,
//                     "ExifImageHeight": 4284,
//                     "SensingMethod": 2,
//                     "ExposureMode": 0,
//                     "WhiteBalance": 0,
//                     "FocalLengthIn35mmFormat": 24,
//                     "LensMake": "Apple",
//                     "LensModel": "iPhone 15 Pro Max back triple camera 6.765mm f/1.78"
//                 }
//             },
//             "imageBase64": ""
//         }
//     ]
// }
