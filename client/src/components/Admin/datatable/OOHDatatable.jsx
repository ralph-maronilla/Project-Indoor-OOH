import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useCallback, useMemo, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CustomDialog from '../popups components/CustomDialog';

const OOHDatatable = ({ data }) => {
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  console.log(data);
  const handleOpenAddressDialog = useCallback((item) => {
    setSelectedItem(item);
    setOpenAddressDialog(true);
  }, []);

  const handleCloseAddressDialog = () => {
    setSelectedItem(null);
    setOpenAddressDialog(false);
  };

  const rows = useMemo(() => {
    console.log(data);
    return data?.map((item) => {
      return {
        id: item?.id,
        company: item.company || '',
        mediaFormat: item.mediaFormat || 'N/A',
        mediaStatus: item.mediaStatus || 'N/A',
        mediaType: item.mediaType || 'N/A',
        location: item.location || 'N/A',
        address_details: item.address || 'N/A',
        details: item.details || 'N/A',
        dimensions: item.dimensions || 'N/A',
      };
    });
  }, [data]);
  // Columns for DataGrid
  const columns = useMemo(() => {
    return [
      { field: 'id', headerName: 'ID', width: 70 },

      { field: 'company', headerName: 'Company', width: 200 },
      {
        field: 'mediaFormat',
        headerName: 'Media Format',
        width: 220,
      },
      {
        field: 'mediaType',
        headerName: 'Media Type',
        width: 220,
      },
      {
        field: 'mediaStatus',
        headerName: 'Media Status',
        width: 220,
      },

      { field: 'location', headerName: 'Location', width: 200 },
      {
        field: 'address_details',
        headerName: 'Address',
        width: 200,
        renderCell: (params) => (
          <Button
            variant='outlined'
            size='small'
            onClick={() => handleOpenAddressDialog(params.row.address_details)}
          >
            View Address
          </Button>
        ),
      },
      {
        field: 'details',
        headerName: 'Details',
        width: 200,
        renderCell: (params) => (
          <Button
            variant='outlined'
            size='small'
            onClick={() => handleOpenAddressDialog(params.row.details)}
          >
            View Address
          </Button>
        ),
      },
      {
        field: 'dimensions',
        headerName: 'Dimensions',
        width: 200,
        renderCell: (params) => (
          <Button
            variant='outlined'
            size='small'
            onClick={() => handleOpenAddressDialog(params.row.dimensions)}
          >
            View Address
          </Button>
        ),
      },
    ];
  }, []);

  // 🔹 Utility to make keys human-readable
  const humanizeKey = (key) => {
    return key
      .replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase
      .replace(/[_\-]/g, ' ') // replace _ and - with space
      .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize words
  };

  const renderRows = (data, parentKey = '') => {
    if (Array.isArray(data)) {
      // Just drill into arrays, no parent row
      return data.flatMap((item, index) =>
        renderRows(item, `${parentKey}[${index}]`)
      );
    } else if (typeof data === 'object' && data !== null) {
      return Object.entries(data).flatMap(([key, value]) => {
        const readableKey = humanizeKey(key);
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
          // 🔁 Don't render row for parent, just drill down
          return renderRows(value, fullKey);
        }

        // ✅ Only render rows for leaf values
        return (
          <TableRow key={fullKey}>
            <TableCell>
              <strong>
                {parentKey
                  ? `${humanizeKey(parentKey.split('.').pop())} → ${readableKey}`
                  : readableKey}
              </strong>
            </TableCell>
            <TableCell>{String(value)}</TableCell>
          </TableRow>
        );
      });
    }
    return null;
  };

  return (
    <>
      <Box
        sx={{
          height: 500,
          width: '100%',
          '& .row-rewarded': {
            backgroundColor: '#2f352fff', // light green
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          // getRowClassName={(params) =>
          //   params.row.isRewarded ? 'row-rewarded' : ''
          // }
        />
      </Box>
      <CustomDialog
        open={openAddressDialog}
        onClose={handleCloseAddressDialog}
        title='Details'
        maxWidth='md'
        actions={<Button onClick={handleCloseAddressDialog}>Close</Button>}
      >
        {selectedItem ? (
          <Table>
            <TableBody>{renderRows(selectedItem)}</TableBody>
          </Table>
        ) : (
          <Typography>No data available</Typography>
        )}
      </CustomDialog>
    </>
  );
};

export default OOHDatatable;
