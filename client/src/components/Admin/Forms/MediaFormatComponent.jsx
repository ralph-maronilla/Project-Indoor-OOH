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

// 🔹 API Calls
const fetchMediaFormats = async (url) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch Media Formats');
  const data = await res.json();
  return data?.data?.media_format ?? [];
};

const addMediaFormat = async (url, payload) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to add Media Format');
  return res.json();
};

const deleteMediaFormat = async (url, id) => {
  const res = await fetch(`${url}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete Media Format');
  return res.json();
};

// 🔹 Component
const MediaFormatComponent = ({ values, errors, touched, setFieldValue }) => {
  const { apiUrls } = useApiStore();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'media_format',
  });

  // Fetch Media Formats
  const { data: mediaFormats = [], isSuccess } = useQuery({
    queryKey: ['media-formats'],
    queryFn: () => fetchMediaFormats(apiUrls.getOOHDropdowns),
  });

  // Add Media Format
  const { mutateAsync: addMediaFormatMutation } = useMutation({
    mutationFn: (payload) => addMediaFormat(apiUrls.postOOHDropdowns, payload),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Media Format added successfully!');
        queryClient.invalidateQueries(['media-formats']);
        handleCloseDialog();
      }
    },
    onError: () => toast.error('Failed to add Media Format'),
  });

  // Delete Media Format
  const { mutate: deleteMediaFormatMutation } = useMutation({
    mutationFn: (id) => deleteMediaFormat(apiUrls.deleteOOHDropdowns, id),
    onSuccess: (data) => {
      toast.success(data.message || 'Deleted successfully!');
      queryClient.invalidateQueries(['media-formats']);
    },
    onError: () => toast.error('Failed to delete Media Format'),
  });

  // Handlers
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: '', category: 'media_format' });
  };

  const handleDialogSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addMediaFormatMutation(formData);
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
          options={isSuccess ? mediaFormats : []}
          getOptionLabel={(option) => option?.name || ''}
          // value={
          //   mediaFormats.find((item) => item.name === values.media_format) ||
          //   null
          // }
          value={
            mediaFormats?.find((item) => item.name === values.media_format) ||
            null
          }
          onChange={(event, newValue) => {
            setFieldValue('media_format', newValue?.name || '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Media Format'
              variant='outlined'
              error={touched.media_format && Boolean(errors.media_format)}
              helperText={touched.media_format && errors.media_format}
            />
          )}
          renderOption={(props, option) => (
            <ListItem {...props} key={option.id}>
              <ListItemText primary={option.name} />
              <IconButton
                edge='end'
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMediaFormatMutation(option.id);
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
        <DialogTitle>Add Media Format</DialogTitle>
        <DialogContent>
          <DialogContentText>Fill in the field below</DialogContentText>
          <form onSubmit={handleDialogSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                type='text'
                name='name'
                label='Media Format'
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

export default MediaFormatComponent;
