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

const MediaFormatComponent = ({
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
  });
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  const MediaFormatDropdown = async () => {
    //   const getMediaFormatDropdownUrl = apiUrls.getAllChannel;
    //   try {
    //     const response = await fetch(`${getMediaFormatDropdownUrl}`, {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       credentials: 'include',
    //       // body: JSON.stringify(data),
    //     });
    //     if (!response.ok) {
    //       throw new Error('Failed to post data');
    //     }
    //     const responseData = await response.json();
    //     return responseData.data;
    //   } catch (error) {
    //     console.log(error);
    //   }
  };
  // const {
  //   isLoading: mediaFormatDropdownLoading,
  //   isError: mediaFormatDropdownError,
  //   isFetching: mediaFormatDropdownFetching,
  //   data: mediaFormatDropdownData,
  //   isSuccess: mediaFormatDropdownSuccess,
  //   refetch: refetchData,
  // } = useQuery({
  //   queryKey: ['get-mediaFormat-dropdown'],
  //   queryFn: MediaFormatDropdown,
  // });

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
    // const addUrl = apiUrls.postChannel;
    // const response = await fetch(`${addUrl}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   credentials: 'include',
    //   body: JSON.stringify(formData),
    // });
    // if (!response.ok) {
    //   throw new Error('Failed to post data');
    // }
    // const responseData = await response.json();
    // return responseData;
  };
  // const { mutateAsync } = useMutation({
  //   mutationFn: postDialogData,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ['get-channel-dropdown'],

  //       refetchType: 'active',
  //     });
  //   },
  // });
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: '' });
  };
  const mediaFormat = ['Static', 'Digital'];
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
          // options={mediaTypeDropdownSuccess ? mediaTypeDropdownData : []}
          options={mediaFormat}
          // getOptionLabel={(option) => option.name || ''}
          value={values.media_format || ''} // ✅ fixed field name
          onChange={(event, newValue) => {
            setFieldValue('media_format', newValue?.name || ''); // ✅ set correct field
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label='Media Format'
              variant='outlined'
              error={touched.media_format && Boolean(errors.media_format)}
              helperText={touched.media_format && errors.media_format}
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
        <DialogTitle>Add Media Format</DialogTitle>

        <DialogContent>
          <DialogContentText>Fill up the fields</DialogContentText>

          <form onSubmit={DialogHandleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'Column' }}>
              <TextField
                type='text'
                name='name'
                label='Media Format'
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

export default MediaFormatComponent;
