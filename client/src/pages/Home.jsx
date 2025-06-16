import { Box, Button, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useState } from 'react';

const Home = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { to, subject, message } = formData;
    console.log('Sending email:', formData);
    // Create the mailto URL
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      message
    )}`;

    // Open the mailto link
    window.location.href = mailtoLink;
    // Add your email sending logic here
  };

  return (
    <Box
      sx={{
        display: 'flex',
        color: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Typography variant='h1'>Home</Typography>
      {/* <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
          border: '2px dashed #ccc',
          borderRadius: '8px',
          width: '600px',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Typography variant='h6' sx={{ mb: 2 }}>
          Send an Email
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            margin='normal'
            label='To'
            name='to'
            value={formData.to}
            onChange={handleChange}
            variant='outlined'
          />
          <TextField
            fullWidth
            margin='normal'
            label='Subject'
            name='subject'
            value={formData.subject}
            onChange={handleChange}
            variant='outlined'
          />
          <TextField
            fullWidth
            margin='normal'
            label='Message'
            name='message'
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={4}
            variant='outlined'
          />
          <Button
            fullWidth
            type='submit'
            variant='contained'
            color='primary'
            sx={{ mt: 2 }}
          >
            Send Email
          </Button>
        </form>
      </Box> */}
    </Box>
  );
};

export default Home;
