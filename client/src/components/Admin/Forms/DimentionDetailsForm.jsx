import React from 'react';
import MediaTypeComponent from './MediaTypeComponent';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

const DimentionDetailsForm = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
}) => {
  return (
    <>
      <Typography variant='h3' sx={{ fontSize: '16px', marginTop: '20px' }}>
        Dimention Details
      </Typography>
      <Grid
        item
        container
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        width='100%'
      >
        <Grid item size={4}>
          <TextField
            fullWidth
            name='dimensions.width_in_ft'
            value={values.dimensions.width_in_ft}
            label='Width in Ft'
            onChange={handleChange}
            error={
              touched?.dimensions?.width_in_ft &&
              Boolean(errors?.dimensions?.width_in_ft)
            }
            helperText={
              touched?.dimensions?.width_in_ft &&
              errors?.dimensions?.width_in_ft
            }
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            name='dimensions.height_in_ft'
            value={values.dimensions.height_in_ft}
            label='Height in Ft'
            onChange={handleChange}
            error={
              touched?.dimensions?.height_in_ft &&
              Boolean(errors?.dimensions?.height_in_ft)
            }
            helperText={
              touched?.dimensions?.height_in_ft &&
              errors?.dimensions?.height_in_ft
            }
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            name='dimensions.diagonal_in_ft'
            value={values.dimensions.diagonal_in_ft}
            label='Diagonal in Ft'
            onChange={handleChange}
            error={
              touched?.dimensions?.diagonal_in_ft &&
              Boolean(errors?.dimensions?.diagonal_in_ft)
            }
            helperText={
              touched?.dimensions?.diagonal_in_ft &&
              errors?.dimensions?.diagonal_in_ft
            }
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            name='dimensions.radius_in_meters'
            value={values.dimensions.radius_in_meters}
            label='Radius (m)'
            onChange={handleChange}
            error={
              touched?.dimensions?.radius_in_meters &&
              Boolean(errors?.dimensions?.radius_in_meters)
            }
            helperText={
              touched?.dimensions?.radius_in_meters &&
              errors?.dimensions?.radius_in_meters
            }
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            select
            fullWidth
            name='dimensions.facing'
            value={values.dimensions.facing}
            label='Facing'
            onChange={handleChange}
            error={
              touched?.dimensions?.facing && Boolean(errors?.dimensions?.facing)
            }
            helperText={
              touched?.dimensions?.facing && errors?.dimensions?.facing
            }
          >
            {['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].map((direction) => (
              <MenuItem key={direction} value={direction}>
                {direction}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </>
  );
};

export default DimentionDetailsForm;
