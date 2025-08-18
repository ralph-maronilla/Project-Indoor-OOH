import React, { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Button from '@mui/material/Button';
import { Formik } from 'formik';
import { useApiStore } from '../store/apiStore';
import { useAppStateStore } from '../store/authStore';
import { useMediaStore } from '../store/mediaStore';
import toast, { Toaster } from 'react-hot-toast';

const loginInitialValues = {
  email: '',
  password: '',
};

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { apiUrls } = useApiStore();
  const { isAuthenticated, setIsAuthenticated, login, setAuthUser } =
    useAppStateStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (values) => {
    console.log('Login submitted:', values);
    try {
      setIsLoading(true);
      console.log(apiUrls.login);
      const response = await fetch(apiUrls.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });
      console.log(response);

      if (!response.ok) {
        toast.error('Login failed', { id: 'login-toast' });
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login response:', data);
      setIsAuthenticated(true);
      setAuthUser(data.user);

      // Update Zustand store

      // login(data.user, data.token);

      navigate('/');
      toast.success('Login successful', { id: 'login-toast' });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />
      <Box sx={{ width: '100%' }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Formik
          initialValues={loginInitialValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleLoginSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  backgroundColor: theme.palette.background.default,
                  height: '500px',
                  width: '700px',
                  padding: '1rem 3rem',
                  justifyContent: 'center',
                  borderRadius: '1rem',
                }}
              >
                <Typography
                  variant='h3'
                  sx={{
                    color: '#333',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    marginY: '1rem',
                  }}
                >
                  Indoor OOH
                </Typography>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    type='submit'
                    variant='contained'
                    sx={{
                      backgroundColor: '#ea5b20',
                      color: '#fff',
                      width: '200px',
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    variant='contained'
                    sx={{
                      backgroundColor: '#2074eaff',
                      color: '#fff',
                      width: '200px',
                    }}
                  >
                    Register
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default Login;
