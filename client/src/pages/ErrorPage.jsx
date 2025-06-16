import { useRouteError } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Box
      id='error-page'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant='h1'>Oops!</Typography>
      <Typography variant='body2'>
        Sorry, an unexpected error has occurred.
      </Typography>
      <Typography variant='body2'>
        <i>{error.statusText || error.message}</i>
      </Typography>
    </Box>
  );
}
