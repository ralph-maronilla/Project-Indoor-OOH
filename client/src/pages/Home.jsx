import { Backdrop, Box, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import CardItem from '../components/dashboard/CardItem';
import AllImageTable from '../components/media/AllImageTable';
import { useApiStore } from '../store/apiStore';
import { useMediaStore } from '../store/mediaStore';
import { useAppStateStore } from '../store/authStore';

const Home = () => {
  const theme = useTheme();
  const apiUrls = useApiStore((state) => state.apiUrls);
  const { authUser } = useAppStateStore((state) => state);
  const { getAllImagesByUserId } = apiUrls;
  const { isLoading: storeLoading, setIsLoading } = useMediaStore();

  // Fetch function for React Query
  const fetchAllImages = async () => {
    const response = await fetch(`${getAllImagesByUserId}/${authUser?.id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    const data = await response.json();
    return data?.data.map((item) => ({
      id: item?.id || 'N/A',
      filename: item?.filename || 'N/A',
      dateTaken: item?.exif?.dateTaken || 'N/A',
      dateUploaded: item?.exif?.dateUploaded || 'N/A',
      locationName: item?.exif?.locationName || 'Unknown',
      latitude: item?.exif?.geolocation?.lat || 'N/A',
      longitude: item?.exif?.geolocation?.lon || 'N/A',
    }));
  };

  // React Query hook
  const {
    data: allImages = [],
    isLoading: queryLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['all-images'],
    queryFn: fetchAllImages,
  });

  // Sync React Query loading state with global store
  useEffect(() => {
    setIsLoading(queryLoading);
  }, [queryLoading, setIsLoading]);
  useEffect(() => {
    console.log('auth user', authUser);
  });

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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <CardItem name='Total Photos' value={allImages.length} />
          <CardItem name='Total Submissions' value='100' />
          <CardItem name='Total Rejected' value='100' />
        </Box>
        <Box sx={{ width: '100%', height: '500px', marginTop: '50px' }}>
          {allImages.length > 0 && <AllImageTable data={allImages} />}
        </Box>
      </Box>
    </>
  );
};

export default Home;
