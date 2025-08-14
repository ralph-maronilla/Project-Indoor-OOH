import React from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';

const AllImageTable = ({ data }) => {
  const theme = useTheme();

  // Dynamically generate columns based on keys in the first data object
  const columns = data?.length
    ? Object.keys(data[0]).map((key) => {
        if (key === 'imageBase64') {
          return {
            field: key,
            headerName: 'Image',
            sortable: false,
            filterable: false,
            width: 100,
            renderCell: (params) =>
              params.value ? (
                <img
                  src={`data:image/jpeg;base64,${params.value}`}
                  alt='Uploaded'
                  style={{ width: 50, height: 50, objectFit: 'cover' }}
                />
              ) : (
                'No Image'
              ),
          };
        }

        return {
          field: key,
          headerName: key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^\w/, (c) => c.toUpperCase()), // Capitalize first letter
          flex: 1,
        };
      })
    : [];

  // Transform the data to be compatible with DataGrid
  const rows = data?.map((item, index) => ({
    id: item.id || index, // Use item.id or fallback to index as row ID
    ...item,
  }));

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: theme.palette.background.default,
        borderRadius: '8px',
        boxShadow: 2,
        height: 600,
      }}
    >
      <Typography variant='h6' gutterBottom>
        Uploaded Images
      </Typography>
      <DataGrid
        rows={rows || []}
        columns={columns || []}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        sx={{
          '& .MuiDataGrid-cell': {
            textAlign: 'center',
          },
        }}
      />
    </Box>
  );
};

export default AllImageTable;
