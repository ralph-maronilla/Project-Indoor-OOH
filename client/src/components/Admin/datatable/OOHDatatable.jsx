import {
  Box,
  Button,
  IconButton,
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

import EditIcon from '@mui/icons-material/Edit';
import OOHEditForm from '../Forms/OOHEditForm';
import { deleteOOHSubmission } from '../../../helpers/postFunctions';
import { useApiStore } from '../../../store/apiStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
const OOHDatatable = ({ data }) => {
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState(null);
  const apiUrls = useApiStore((state) => state.apiUrls);

  const handleOpenDialog = useCallback((item) => {
    setSelectedItem(item);

    setOpenAddressDialog(true);
  }, []);
  const handleOpenEditDialog = useCallback((item) => {
    setSelectedItem(item);

    setOpenEditDialog(true);
  }, []);

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setOpenAddressDialog(false);
  };
  const handleCloseEditDialog = () => {
    setSelectedItem(null);
    setOpenEditDialog(false);
  };
  const handleOpenDeleteDialog = useCallback((item) => {
    setSelectedItem(item);
    setOpenDeleteDialog(true);
  }, []);
  const handleCloseDeleteDialog = () => {
    setSelectedItem(null);
    setOpenDeleteDialog(false);
  };
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteOOHSubmission(apiUrls.deleteOOH, id),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-ooh']); // 🔄 refresh the OOH list
      handleCloseDeleteDialog();
    },
    onError: (err) => {
      console.error('Delete failed:', err);
      alert('Failed to delete item. Please try again.');
    },
  });
  const handleConfirmDelete = () => {
    if (selectedItem?.id) {
      deleteMutation.mutate(selectedItem.id);
    }
  };

  const rows = useMemo(() => {
    return data?.map((item) => {
      return {
        id: item?.id,
        company: item.company || '',
        mediaFormat: item.mediaFormat || 'N/A',
        mediaStatus: item.mediaStatus || 'N/A',
        mediaType: item.mediaType || 'N/A',
        location: item.location || 'N/A',
        latitude: item.latitude || 'N/A',
        longitude: item.longitude || 'N/A',
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
            onClick={() => handleOpenDialog(params.row.address_details)}
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
            onClick={() => handleOpenDialog(params.row.details)}
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
            onClick={() => handleOpenDialog(params.row.dimensions)}
          >
            View Address
          </Button>
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => (
          <>
            <IconButton
              color='success'
              size='small'
              onClick={() => {
                handleOpenEditDialog(params.row);
                console.log(params.row);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color='error'
              size='small'
              onClick={() => handleOpenDeleteDialog(params.row)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        ),
      },
    ];
  }, [handleOpenDialog]);

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
        onClose={handleCloseDialog}
        title='Details'
        maxWidth='md'
        actions={<Button onClick={handleCloseDialog}>Close</Button>}
      >
        {selectedItem ? (
          <Table>
            <TableBody>{renderRows(selectedItem)}</TableBody>
          </Table>
        ) : (
          <Typography>No data available</Typography>
        )}
      </CustomDialog>
      <CustomDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        title='Edit OOH'
        maxWidth='md'
        actions={<Button onClick={handleCloseEditDialog}>Close</Button>}
      >
        {selectedItem && (
          <OOHEditForm
            data={selectedItem}
            handleCloseDialog={handleCloseEditDialog}
          />
        )}
      </CustomDialog>
      {/* Delete confirmation */}
      <CustomDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title='Confirm Delete'
        actions={
          <>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button color='error' onClick={handleConfirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <Typography>
          Are you sure you want to delete OOH item{' '}
          <strong>{selectedItem?.id}</strong>?
        </Typography>
      </CustomDialog>
    </>
  );
};

export default OOHDatatable;
