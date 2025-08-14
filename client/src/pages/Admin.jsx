import React, { useState } from 'react';
import AllImageTable from '../components/media/AllImageTable';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CardItem from '../components/dashboard/CardItem';
import { useMediaStore } from '../store/mediaStore';
import { useApiStore } from '../store/apiStore';

const Admin = () => {
  const theme = useTheme();
  const apiUrls = useApiStore((state) => state.apiUrls);
  const { getAllImages } = apiUrls;
  const { isLoading, setIsLoading } = useMediaStore();

  const [allImages, setAllImages] = useState([]);

  return (
    <>
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
          width: `calc(100% - 240px)`,
          marginLeft: '240px',
          display: 'flex',
          flexDirection: 'column',
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
        <Box sx={{ width: '100%', height: '500px', marginTop: '50px' }}>
          {/* {getAllImages && <AllImageTable data={allImages} />} */}
        </Box>
      </Box>
    </>
  );
};

export default Admin;
