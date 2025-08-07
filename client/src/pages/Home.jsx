import { Box, Button, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useState } from 'react';
import CardItem from '../components/dashboard/CardItem';

const Home = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: `calc(100% - 240px)`,
        marginLeft: '240px',
        display: 'flex',

        padding: '20px',
        // justifyContent: 'center',
        // alignItems: 'center',
        height: '100vh',
        color: theme.palette.text.primary,
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <CardItem name='Total Photos' value='100' />
        <CardItem name='Total Submissions' value='100' />
        <CardItem name='Total Rejected' value='100' />
      </Box>
    </Box>
  );
};

export default Home;
