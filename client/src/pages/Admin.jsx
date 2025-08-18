import React, { useState, useEffect } from 'react';
import AllImageTable from '../components/media/AllImageTable';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CardItem from '../components/dashboard/CardItem';
import { useMediaStore } from '../store/mediaStore';
import { useApiStore } from '../store/apiStore';

import { getSubmissions } from '../helpers/getFunctions';
import AdminSubmissionsTable from '../components/Admin/datatable/AdminSubmissionsTable';
import { useQuery } from '@tanstack/react-query';

const Admin = () => {
  const theme = useTheme();
  const apiUrls = useApiStore((state) => state.apiUrls);
  const { getAllSubmissions } = apiUrls;
  const { isLoading: storeLoading, setIsLoading } = useMediaStore();

  const fetchAllSubmissions = async () => {
    const response = await getSubmissions(getAllSubmissions, 'GET');
    return response.data;
  };

  const {
    data: adminImages = [],
    isLoading: queryLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['fetch-admin-submissions'],
    queryFn: fetchAllSubmissions,
  });

  // Sync React Query loading state to store
  useEffect(() => {
    setIsLoading(queryLoading);
  }, [queryLoading, setIsLoading]);

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={storeLoading}
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
          height: '100vh',
          color: theme.palette.text.primary,
        }}
      >
        {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <CardItem name='Total Photos' value='100' />
          <CardItem name='Total Submissions' value='100' />
          <CardItem name='Total Rejected' value='100' />
        </Box> */}
        <Box sx={{ width: '100%', height: '500px', marginTop: '50px' }}>
          {adminImages.length > 0 && (
            <AdminSubmissionsTable data={adminImages} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Admin;
