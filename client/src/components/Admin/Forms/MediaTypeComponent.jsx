import React, { useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useApiStore } from '../../../store/apiStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// 🔹 API Calls (isolated for clarity)
const fetchMediaTypes = async (url) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch Media Types');
  const data = await res.json();
  return data?.data?.media_type ?? [];
};

const addMediaType = async ({ url, payload }) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to add Media Type');
  return res.json();
};

const deleteMediaType = async ({ url, id }) => {
  const res = await fetch(`${url}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete Media Type');
  return res.json();
};

// 🔹 Component
const MediaTypeComponent = ({ values, errors, touched, setFieldValue }) => {
  const { apiUrls } = useApiStore();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'media_type',
  });

  // Fetch Media Types
  const { data: mediaTypes = [], isSuccess } = useQuery({
    queryKey: ['media-types'],
    queryFn: () => fetchMediaTypes(apiUrls.getOOHDropdowns),
  });

  // Add Media Type
  const { mutateAsync: addMediaTypeMutation } = useMutation({
    mutationFn: (payload) =>
      addMediaType({ url: apiUrls.postOOHDropdowns, payload }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Media Type added successfully!');
        queryClient.invalidateQueries(['media-types']);
        handleCloseDialog();
      }
    },
    onError: () => toast.error('Failed to add Media Type'),
  });

  // Delete Media Type
  const { mutate: deleteMediaTypeMutation } = useMutation({
    mutationFn: (id) =>
      deleteMediaType({ url: apiUrls.deleteOOHDropdowns, id }),
    onSuccess: (data) => {
      toast.success(data.message || 'Deleted successfully!');
      queryClient.invalidateQueries(['media-types']);
    },
    onError: () => toast.error('Failed to delete Media Type'),
  });

  // Handlers
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: '', category: 'media_type' });
  };

  const handleDialogSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addMediaTypeMutation(formData);
  };

  return (
    <>
      {/* Dropdown with Add + Delete */}
      <FormControl fullWidth>
        <InputAdornment
          position='end'
          sx={{ position: 'absolute', right: 0, top: -30 }}
        >
          <Button onClick={handleOpenDialog} size='small'>
            + Add New
          </Button>
        </InputAdornment>

        <Autocomplete
          fullWidth
          options={isSuccess ? mediaTypes : []}
          getOptionLabel={(option) => option?.name || ''}
          value={
            mediaTypes.find((item) => item.name === values.media_type) || null
          }
          onChange={(event, newValue) => {
            setFieldValue('media_type', newValue?.name || '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Media Type'
              variant='outlined'
              error={touched.media_type && Boolean(errors.media_type)}
              helperText={touched.media_type && errors.media_type}
            />
          )}
          renderOption={(props, option) => (
            <ListItem {...props} key={option.id}>
              <ListItemText primary={option.name} />
              <IconButton
                edge='end'
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMediaTypeMutation(option.id);
                }}
              >
                <ClearIcon sx={{ color: 'red' }} />
              </IconButton>
            </ListItem>
          )}
        />
      </FormControl>

      {/* Add New Dialog */}
      <Dialog
        onClose={handleCloseDialog}
        open={openDialog}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>Add Media Type</DialogTitle>
        <DialogContent>
          <DialogContentText>Fill in the field below</DialogContentText>
          <form onSubmit={handleDialogSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                type='text'
                name='name'
                label='Media Type'
                sx={{ marginY: '10px', width: '38ch' }}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Button
                variant='contained'
                type='submit'
                sx={{ mt: 2, width: '50%' }}
              >
                Submit
              </Button>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MediaTypeComponent;
