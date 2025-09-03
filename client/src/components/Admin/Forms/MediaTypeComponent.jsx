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
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useApiStore } from '../../../store/apiStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const MediaTypeComponent = ({
  values,
  errors,
  touched,
  handleBlur,
  handleChange,
  setFieldValue,
}) => {
  const { apiUrls } = useApiStore();
  const [formData, setFormData] = useState({
    name: '',
    category: 'media_type',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  const MediaTypeDropdown = async () => {
    const getMediaTypeDropdownUrl = apiUrls.getOOHDropdowns;
    try {
      const response = await fetch(`${getMediaTypeDropdownUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        // body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to post data');
      }
      const responseData = await response.json();
      console.log(responseData);
      return responseData?.data?.media_type ?? [];
    } catch (error) {
      console.log(error);
    }
  };
  const {
    isLoading: mediaTypeDropdownLoading,
    isError: mediaTypeDropdownError,
    isFetching: mediaTypeDropdownFetching,
    data: mediaTypeDropdownData,
    isSuccess: mediaTypeDropdownSuccess,
    refetch: refetchData,
  } = useQuery({
    queryKey: ['get-mediaType-dropdown'],
    queryFn: MediaTypeDropdown,
  });

  const DialogHandleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await mutateAsync(formData);
      if (response.success) {
        toast.success('Add Media Type Successful', {
          duration: 4000, // Duration in milliseconds
          position: 'top-right', // Position of the toast
        });
        handleCloseDialog();
        refetchData();
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const postDialogData = async () => {
    const addUrl = apiUrls.postOOHDropdowns;
    const response = await fetch(`${addUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error('Failed to post data');
    }
    const responseData = await response.json();
    return responseData;
  };
  const { mutateAsync } = useMutation({
    mutationFn: postDialogData,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-mediaType-dropdown'],

        refetchType: 'active',
      });
    },
  });
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: '' });
  };

  return (
    <>
      <FormControl fullWidth>
        <InputAdornment
          position='end'
          sx={{ position: 'absolute', right: 0, top: -30 }}
        >
          <Button onClick={handleOpenDialog} size='small'>
            +Add New
          </Button>
        </InputAdornment>
        <Autocomplete
          freeSolo
          fullWidth
          options={mediaTypeDropdownSuccess ? mediaTypeDropdownData : []}
          // options={mediaTypes}
          getOptionLabel={(option) => option?.name || ''}
          values={values.media_type || ''}
          // value={
          //   mediaTypeDropdownData?.find(
          //     (item) => item?.name === values?.media_type
          //   ) || null
          // }
          onChange={(event, newValue) => {
            console.log('newValue', newValue);
            setFieldValue('media_type', newValue.name || ''); // ✅ set correct field
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label='Media Type'
              variant='outlined'
              error={touched.media_type && Boolean(errors.media_type)}
              helperText={touched.media_type && errors.media_type}
            />
          )}
        />
      </FormControl>

      <Dialog
        onClose={handleCloseDialog}
        open={openDialog}
        fullWidth={true}
        maxWidth='sm'
      >
        <DialogTitle>Add Media Type</DialogTitle>

        <DialogContent>
          <DialogContentText>Fill up the fields</DialogContentText>

          <form onSubmit={DialogHandleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'Column' }}>
              <TextField
                type='text'
                name='name'
                label='Media Type'
                sx={{ marginY: '10px', width: '38ch' }}
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />

              <Button
                variant='contained'
                type='submit'
                size='large'
                sx={{
                  background: 'theme.palette.primary.main',
                  color: 'theme.text.primary',

                  marginY: '10px',
                  width: '50%',
                }}
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
