import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, TextField, Button } from '@mui/material';
import { toast } from 'react-hot-toast';
import { postRewardSubmission } from '../../../helpers/postFunctions';
import { useApiStore } from '../../../store/apiStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMediaStore } from '../../../store/mediaStore';
import { useAppStateStore } from '../../../store/authStore';

// ✅ Yup validation schema
const validationSchema = Yup.object().shape({
  user_email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  user_fullname: Yup.string().required('Full name is required'),
  user_mobilenumber: Yup.string().required('Mobile number is required'),
  reward_amount: Yup.number()
    .typeError('Reward amount must be a number')
    .positive('Reward amount must be greater than zero')
    .required('Reward amount is required'),
  reward_description: Yup.string()
    .min(5, 'Description must be at least 5 characters')
    .required('Reward description is required'),
  image: Yup.mixed().required('Transaction receipt is required'),

  reward_reference_number: Yup.string()
    // .matches(/^\d+$/, 'Reference number must be numeric')
    .required('Reference number is required'),
});

const RewardForms = ({ selectedUser, handleCloseRewards }) => {
  const { apiUrls } = useApiStore();
  const setIsLoading = useMediaStore((state) => state.setIsLoading);
  const isLoading = useMediaStore((state) => state.isLoading);
  const queryClient = useQueryClient();
  const authUser = useAppStateStore((state) => state.authUser);

  const handleRewardSubmit = async (values) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('user_email', values.user_email);
      formData.append('user_fullname', values.user_fullname);
      formData.append('user_mobilenumber', values.user_mobilenumber);
      formData.append('reward_amount', values.reward_amount);
      formData.append('reward_description', values.reward_description);
      formData.append(
        'reward_reference_number',
        values.reward_reference_number
      );
      formData.append('submitted_by', authUser?.id);
      formData.append('submission_id', selectedUser?.id);

      if (values.image) {
        formData.append('image', values.image); // ✅ file goes here
      }
      console.log(apiUrls.rewardSubmission);
      const response = await postRewardSubmission(
        apiUrls.rewardSubmission,
        formData // ✅ send FormData, not JSON
      );
      console.log(response);

      //   if (!response.ok) {
      //     throw new Error(`HTTP error! Status: ${response.status}`);
      //   }
      toast.success(response?.message, { id: 'reward-toast' });
      queryClient.invalidateQueries(['fetch-admin-submissions']);
      // ✅ close dialog after success
      handleCloseRewards();
    } catch (error) {
      console.log('error in submitting rewards', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      user_email: selectedUser.email,
      user_fullname: `${selectedUser?.submitted_by.first_name} ${selectedUser?.submitted_by.last_name}`,
      user_mobilenumber: selectedUser?.submitted_by.mobile_number,

      reward_amount: '',
      reward_description: '',
      image: null,
      reward_reference_number: '',
    },
    validationSchema,
    onSubmit: handleRewardSubmit,
  });

  //   useEffect(() => {
  //     console.log('selected row', selectedUser);
  //   });

  return (
    <Box sx={{ mt: 2 }}>
      {selectedUser ? (
        <form onSubmit={formik.handleSubmit} encType='multipart/form-data'>
          {/* <pre>{JSON.stringify(formik.values)}</pre> */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* ✅ User Info */}
            <Typography>
              <strong>Email: </strong> {selectedUser.email}
            </Typography>
            <Typography>
              <strong>Name: </strong> {selectedUser?.submitted_by.first_name}{' '}
              {selectedUser?.submitted_by.last_name}
            </Typography>
            <Typography>
              <strong>Mobile Number: </strong>{' '}
              {selectedUser?.submitted_by.mobile_number}
            </Typography>

            {/* ✅ Reward Amount */}
            <TextField
              label='Reward Amount'
              type='number'
              fullWidth
              size='small'
              name='reward_amount'
              value={formik.values.reward_amount}
              onChange={formik.handleChange}
              error={
                formik.touched.reward_amount &&
                Boolean(formik.errors.reward_amount)
              }
              helperText={
                formik.touched.reward_amount && formik.errors.reward_amount
              }
            />

            {/* ✅ Reward Description */}
            <TextField
              label='Reward Description'
              multiline
              rows={3}
              fullWidth
              size='small'
              name='reward_description'
              value={formik.values.reward_description}
              onChange={formik.handleChange}
              error={
                formik.touched.reward_description &&
                Boolean(formik.errors.reward_description)
              }
              helperText={
                formik.touched.reward_description &&
                formik.errors.reward_description
              }
            />

            {/* ✅ GCash Receipt Upload */}
            <small>Upload GCash receipt</small>
            <Button variant='outlined' component='label' color='text'>
              Upload Transaction Receipt
              <input
                type='file'
                hidden
                accept='image/*,.pdf'
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    formik.setFieldValue('image', e.target.files[0]);
                    toast.success(`File selected: ${e.target.files[0].name}`);
                  }
                }}
              />
            </Button>
            {/* Show file name if uploaded */}
            {formik.values.image && (
              <Typography variant='caption'>
                {' '}
                Filename: <strong>{formik.values.image.name}</strong>
              </Typography>
            )}
            {formik.errors.image && (
              <Typography variant='caption' color='error'>
                {formik.errors.image}
              </Typography>
            )}

            {/* ✅ GCash Reference Number */}
            <TextField
              label='GCash Reference Number'
              fullWidth
              size='small'
              name='reward_reference_number'
              value={formik.values.reward_reference_number}
              onChange={formik.handleChange}
              error={
                formik.touched.reward_reference_number &&
                Boolean(formik.errors.reward_reference_number)
              }
              helperText={
                formik.touched.reward_reference_number &&
                formik.errors.reward_reference_number
              }
            />

            {/* ✅ Submit Button */}
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={isLoading}
            >
              Submit Reward
            </Button>
          </Box>
        </form>
      ) : (
        <Typography>No user selected for rewards.</Typography>
      )}
    </Box>
  );
};

export default RewardForms;
