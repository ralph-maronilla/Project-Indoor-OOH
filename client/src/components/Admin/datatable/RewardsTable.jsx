import React, { useEffect, useMemo, useState } from 'react';
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
  TextField,
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

import { postRewardSubmission } from '../../../helpers/postFunctions';
import RewardForms from '../Forms/RewardForms';
import Lightboxdialog from '../popups components/Lightboxdialog';

const RewardsTable = ({ data, onStatusChange }) => {
  const authUser = useAppStateStore((state) => state.authUser);
  const setIsLoading = useMediaStore((state) => state.setIsLoading);

  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  const [openExifDialog, setOpenExifDialog] = useState(false);
  const [selectedExif, setSelectedExif] = useState(null);

  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
      queryClient.invalidateQueries(['submissions']);
    }
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  // Transform API data

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
    onSuccess: () => {
      toast.success('Status updated successfully!');
      queryClient.invalidateQueries(['fetch-admin-submissions']); // ✅ refetch submissions table
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update status');
    },
  });

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
  // useEffect(() => {
  //   console.log('admin data', data);
  // }, []);
  const formatExifDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const cleaned = dateStr.replace(' at ', ' ');
    const date = new Date(cleaned);
    return isNaN(date.getTime())
      ? 'Invalid Date'
      : date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
  };
  const rows = useMemo(() => {
    return data.map((item) => {
      const img = item.images?.[0];
      return {
        id: item.id,
        filename: img?.filename || '',
        location: img?.exif?.locationName || 'N/A',
        dateTaken: formatExifDate(img?.exif?.dateTaken),
        dateUploaded: formatExifDate(img?.exif?.dateUploaded),
        imageBase64: img?.imageBase64 || '',
        status: item.status,
        exifData: img?.exif?.exifData || {},
        email: item?.submitted_by?.email || '',
        submitted_by: item?.submitted_by || {},
        rewarded_date: item?.submitted_by?.reward_details?.createdAt
          ? new Date(
              item?.submitted_by?.reward_details?.createdAt
            ).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })
          : '',
        isRewarded: item.isRewarded,
      };
    });
  }, [data]);
  // Columns for DataGrid
  const columns = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 70 },
      {
        field: 'imageBase64',
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
              onClick={() => handleOpenLightbox(params.value)}
            />
          );
        },
      },
      { field: 'filename', headerName: 'Filename', width: 200 },
      { field: 'email', headerName: 'Email', width: 220 },
      {
        field: 'user_details',
        headerName: 'User Details',
        width: 150,
        renderCell: (params) => (
          <Button onClick={() => handleOpenUserDialog(params.row.submitted_by)}>
            View Details
          </Button>
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
      { field: 'rewarded_date', headerName: 'Rewarded Date', width: 200 },
      {
        field: 'isRewarded',
        headerName: 'Rewarded',
        width: 150,
        renderCell: (params) => (
          <Chip
            label={params.value === 1 ? 'Rewarded' : 'Not Rewarded'}
            onClick={() => handleOpenRewardDialog(params.row)}
            color={params.value === 1 ? 'success' : 'error'}
          />
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => (
          <>
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
    ],
    [
      handleOpenLightbox,
      handleOpenUserDialog,
      handleOpenExif,
      handleStatusSelect,
      handleOpenRewardDialog,
      handleOpenDeleteDialog,
    ]
  );

  return (
    <>
      {/* Data Table */}
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Box>

      {/* Lightbox */}

      <Lightboxdialog
        open={openLightbox}
        onClose={handleCloseLightbox}
        selectedImage={selectedImage}
      />

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
        <RewardForms
          selectedUser={selectedUser}
          handleCloseRewards={handleCloseRewards}
        />
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: '100%' }}>
              <Typography>
                <strong>Email:</strong> {selectedReward.submitted_by?.email}
              </Typography>
              <Typography>
                <strong>Fullname:</strong>{' '}
                {selectedReward.submitted_by?.first_name}{' '}
                {selectedReward.submitted_by?.last_name}
              </Typography>

              <Typography>
                <strong>Mobile:</strong>{' '}
                {selectedReward?.submitted_by.mobile_number}
              </Typography>

              <Typography>
                <strong>Rewarded:</strong>{' '}
                {selectedReward.isRewarded ? 'Yes' : 'No'}
              </Typography>
              <Typography>
                <strong>Reward Amount:</strong>{' '}
                {selectedReward?.submitted_by?.reward_details?.rewardAmount}
              </Typography>
              <Typography>
                <strong>Reward Description:</strong>{' '}
                {
                  selectedReward?.submitted_by?.reward_details
                    ?.rewardDescription
                }
              </Typography>
              <Typography>
                <strong>Reference Number:</strong>{' '}
                {
                  selectedReward?.submitted_by?.reward_details
                    ?.rewardReferenceNumber
                }
              </Typography>
              <Box sx={{ width: '100%' }}>
                {selectedReward?.submitted_by?.reward_details && (
                  <Box
                    sx={{
                      display: 'flex',
                      // justifyContent: 'center',
                      // alignItems: 'center',
                      // backgroundColor: '#000',
                    }}
                  >
                    <img
                      src={
                        selectedReward?.submitted_by?.reward_details
                          ?.rewardReceipt
                      }
                      alt='Preview'
                      style={{
                        maxWidth: '50%',
                        maxHeight: '100%',
                        borderRadius: '8px',
                      }}
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

export default RewardsTable;
