import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';
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
  const { getAllSubmissionsByUserId } = apiUrls;
  const { isLoading: storeLoading, setIsLoading } = useMediaStore();

  // Fetch function for React Query
  const fetchAllImages = async () => {
    const response = await fetch(
      `${getAllSubmissionsByUserId}/${authUser?.id}`
    );
    const data = await response.json();
    console.log(data);

    return (
      data?.submissions?.map((item) => ({
        user: data?.user,
        images: item?.images?.map((image, index) => ({
          id: image?.id ?? `temp-${index}`,
          filename: image?.filename || 'N/A',
          imageBase64: image?.imageBase64 || 'N/A',
          dateTaken: image?.exif?.dateTaken || 'N/A',
          dateUploaded: image?.exif?.dateUploaded || 'N/A',
          locationName: image?.exif?.locationName || 'Unknown',
          latitude: image?.exif?.geolocation?.lat || 'N/A',
          longitude: image?.exif?.geolocation?.lon || 'N/A',
        })),
        isApproved: item.isApproved,
        isRewarded: item.isRewarded,
        reward_details: item.reward_details,
      })) ?? []
    );
  };

  // React Query hook
  const {
    data: allImages = [],
    isLoading: queryLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['all-images-by-user'],
    queryFn: fetchAllImages,
  });

  // Sync React Query loading state with global store
  useEffect(() => {
    setIsLoading(queryLoading);
  }, [queryLoading, setIsLoading]);

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  const approvedSubmissionsCount = allImages.filter(
    (submission) => submission.isApproved === 1
  ).length;

  // ✅ Compute as number
  const totalEarnings = allImages.reduce((total, submission) => {
    if (
      submission.isApproved === 1 &&
      submission.reward_details?.rewardAmount
    ) {
      return total + parseFloat(submission.reward_details.rewardAmount);
    }
    return total;
  }, 0);

  // ✅ Format safely
  const formattedEarnings = isNaN(totalEarnings)
    ? '₱0.00'
    : totalEarnings.toLocaleString('en-US', {
        style: 'currency',
        currency: 'PHP',
      });

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
          <CardItem name='Total Photos Submitted' value={allImages.length} />
          <CardItem
            name='Total Approved Submissions'
            value={approvedSubmissionsCount}
          />
          <CardItem name='Total Earnings' value={formattedEarnings} />
        </Box>

        <Box sx={{ width: '100%', height: '500px', marginTop: '50px' }}>
          {allImages.length === 0 ? (
            <Typography
              variant='h6'
              sx={{ textAlign: 'center', marginTop: '50px' }}
            >
              No data yet
            </Typography>
          ) : (
            <AllImageTable data={allImages} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Home;
