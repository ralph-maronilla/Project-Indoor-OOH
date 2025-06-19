import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CardItem = ({ name, value }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        width: '200px',
        height: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        boxShadow: 2,
        backgroundColor: theme.palette.background.default,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography
            variant='h6'
            component='div'
            color='primary'
            sx={{ fontWeight: 'bold' }}
          >
            {name}
          </Typography>
          <Typography variant='h4' component='div' color='textSecondary'>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardItem;
