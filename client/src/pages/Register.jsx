import {
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useApiStore } from '../store/apiStore';
import { useAppStateStore } from '../store/authStore';

const registerInitialValues = {
  first_name: '',
  last_name: '',
  address: '',
  mobile_number: '',
  photo: null,
  email: '',
  password: '',
};

const registerValidationSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters'),

  last_name: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters'),

  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),

  mobile_number: Yup.string()
    .required('Mobile number is required')
    .matches(/^\+?[0-9]{10,15}$/, 'Invalid mobile number format'),

  photo: Yup.mixed()
    .nullable()
    .test(
      'fileSize',
      'File size too large (max 5MB)',
      (value) => !value || (value && value.size <= 5 * 1024 * 1024)
    )
    .test(
      'fileType',
      'Unsupported file format',
      (value) =>
        !value ||
        (value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type))
    ),

  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[@$!%*?&]/,
      'Password must contain at least one special character'
    ),
});

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { apiUrls } = useApiStore();

  const handleRegisterSubmit = async (values) => {
    console.log('registration submitted:', values);
    try {
      console.log(apiUrls.register);
      const response = await fetch(apiUrls.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('registration response:', data);

      // Update Zustand store

      // login(data.user, data.token);

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Formik
          initialValues={registerInitialValues}
          validationSchema={registerValidationSchema}
          onSubmit={handleRegisterSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit} encType='multipart/form-data'>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  backgroundColor: theme.palette.background.default,
                  height: 'auto',
                  width: '700px',
                  padding: '2rem 3rem',
                  justifyContent: 'center',
                  borderRadius: '1rem',
                }}
              >
                <Typography
                  variant='h3'
                  sx={{
                    color: theme.palette.text.primary,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    marginY: '1rem',
                  }}
                >
                  Register
                </Typography>

                <FormControl>
                  <TextField
                    label='First Name'
                    name='first_name'
                    value={values.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.first_name && Boolean(errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                  />
                </FormControl>

                <FormControl>
                  <TextField
                    label='Last Name'
                    name='last_name'
                    value={values.last_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.last_name && Boolean(errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                  />
                </FormControl>

                <FormControl>
                  <TextField
                    label='Address'
                    name='address'
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </FormControl>

                <FormControl>
                  <TextField
                    label='Mobile Number'
                    name='mobile_number'
                    value={values.mobile_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.mobile_number && Boolean(errors.mobile_number)
                    }
                    helperText={touched.mobile_number && errors.mobile_number}
                  />
                </FormControl>

                <FormControl>
                  <Typography
                    variant='body1'
                    sx={{ mb: 1, color: theme.palette.text.primary }}
                  >
                    Avatar / Photo
                  </Typography>
                  <input
                    type='file'
                    name='photo'
                    accept='image/*'
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue('photo', file);
                    }}
                    onBlur={handleBlur}
                    style={{ marginTop: '8px' }}
                  />

                  {/* Show file name if selected */}
                  {values.photo && (
                    <Typography
                      variant='body2'
                      sx={{ mt: 1, color: theme.palette.text.primary }}
                    >
                      Selected file: <strong>{values.photo.name}</strong>
                    </Typography>
                  )}

                  {/* Validation error */}
                  {touched.photo && errors.photo && (
                    <Typography color='error' variant='body2'>
                      {errors.photo}
                    </Typography>
                  )}
                </FormControl>

                <FormControl>
                  <TextField
                    label='Email'
                    name='email'
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </FormControl>

                <FormControl>
                  <TextField
                    label='Password'
                    name='password'
                    type='password'
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </FormControl>

                <Button
                  type='submit'
                  variant='contained'
                  sx={{
                    backgroundColor: '#ea5b20',
                    color: '#fff',
                    width: '200px',
                    alignSelf: 'center',
                  }}
                >
                  Register
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default Register;
