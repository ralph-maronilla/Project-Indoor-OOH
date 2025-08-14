import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ImageDataTable = ({ data }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: theme.palette.background.default,

        borderRadius: '8px',
        boxShadow: 2,
      }}
    >
      <Typography variant='h6' gutterBottom>
        Uploaded Images
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell align='center'>Image</TableCell>
              <TableCell align='center'>Latitude</TableCell>
              <TableCell align='center'>Longitude</TableCell>
              <TableCell align='center'>Date Taken</TableCell>
              <TableCell align='center'>Date Uploaded</TableCell>
              <TableCell align='center'>Location Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.filename}</TableCell>
                <TableCell>{item.filename}</TableCell>
                <TableCell align='center'>
                  {item.exif.geolocation.lat}
                </TableCell>
                <TableCell align='center'>
                  {item.exif.geolocation.lon}
                </TableCell>
                <TableCell align='center'>{item.exif.dateTaken}</TableCell>
                <TableCell align='center'>{item.exif.dateUploaded}</TableCell>
                <TableCell align='center'>{item.exif.locationName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ImageDataTable;
