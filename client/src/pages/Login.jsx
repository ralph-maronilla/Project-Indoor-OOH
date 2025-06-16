import React, { use } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {
  Box,
  FormControl,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Button from '@mui/material/Button';
import { Formik } from 'formik';
import { useApiStore } from '../store/apiStore';
import { useAuthStore } from '../store/authStore';

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
  const { isAuthenticated, setIsAuthenticated, login } = useAuthStore();
  const handleLoginSubmit = async (values) => {
    console.log('Login submitted:', values);
    try {
      console.log(apiUrls.login);
      const response = await fetch(apiUrls.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login response:', data);
      setIsAuthenticated(true);

      // Update Zustand store

      // login(data.user, data.token);

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  return (
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
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
