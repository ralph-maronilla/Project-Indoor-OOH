import {
  Backdrop,
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect } from 'react';
import RewardsTable from '../components/Admin/datatable/RewardsTable';
import { useQuery } from '@tanstack/react-query';
import { useApiStore } from '../store/apiStore';
import { useMediaStore } from '../store/mediaStore';
import { getSubmissions } from '../helpers/getFunctions';

const Rewards = () => {
  const theme = useTheme();
  const apiUrls = useApiStore((state) => state.apiUrls);
  const { getAllSubmissions } = apiUrls;
  const { isLoading, setIsLoading } = useMediaStore();

  const fetchAllSubmissions = async () => {
    let isApprovedArray = [];
    const response = await getSubmissions(getAllSubmissions, 'GET');
    const data = await response.data;
    data.map((item) => {
      item.isApproved === 1 ? isApprovedArray.push(item) : [];
    });
    console.log('is approved', isApprovedArray);

    return isApprovedArray;
  };

  const {
    data: adminImages = [],
    isLoading: queryLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['fetch-admin-rewards-submissions'],
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
            height: '100vh',
            color: theme.palette.text.primary,
          }}
        >
          <Typography variant='h4'>List of approved submissions</Typography>

          {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <CardItem name='Total Photos' value='100' />
          <CardItem name='Total Submissions' value='100' />
          <CardItem name='Total Rejected' value='100' />
        </Box> */}
          <Box sx={{ width: '100%', height: '500px', marginTop: '50px' }}>
            {adminImages.length > 0 && <RewardsTable data={adminImages} />}
          </Box>
        </Box>
      </>
    </>
  );
};

export default Rewards;
