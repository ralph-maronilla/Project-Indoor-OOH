import React, { useEffect } from 'react';
import OOHDatatable from '../components/Admin/datatable/OOHDatatable';
import { Backdrop, Box, CircularProgress, useTheme } from '@mui/material';
import { useApiStore } from '../store/apiStore';
import { getOohData } from '../helpers/getFunctions';
import { useQuery } from '@tanstack/react-query';
import { useMediaStore } from '../store/mediaStore';

const ViewInventory = () => {
  const theme = useTheme();
  const apiUrls = useApiStore((state) => state.apiUrls);
  const { isLoading: storeLoading, setIsLoading } = useMediaStore();

  const fetchOoh = async () => {
    const response = await getOohData(apiUrls.getOOH, 'GET');
    return response;
  };
  const {
    data: oohData,
    isLoading: queryLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['fetch-ooh'],
    queryFn: fetchOoh,
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
        {oohData?.length > 0 ? (
          <OOHDatatable data={oohData} />
        ) : (
          <p>OOH Inventory is empty</p>
        )}
      </Box>
    </>
  );
};

export default ViewInventory;
