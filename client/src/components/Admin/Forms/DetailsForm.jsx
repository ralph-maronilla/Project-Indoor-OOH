import React from 'react';
import MediaTypeComponent from './MediaTypeComponent';
import { Grid, TextField, Typography } from '@mui/material';

const DetailsForm = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
}) => {
  return (
    <>
      <Typography variant='h3' sx={{ fontSize: '16px', marginTop: '20px' }}>
        Additional Details
      </Typography>
      <Grid
        item
        container
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        width={'100%'}
      >
        <Grid item size={4}>
          <TextField
            fullWidth
            multiline
            rows={4}
            name='details.traffic'
            value={values?.details.traffic}
            label='Traffic Details'
            onChange={handleChange}
            error={
              touched?.details?.traffic && Boolean(errors?.details?.traffic)
            }
            helperText={touched?.details?.traffic && errors?.details?.traffic}
          />
        </Grid>
        <Grid item size={4}>
          <TextField
            fullWidth
            type='number'
            name='details.traffic_count'
            value={values?.details.traffic_count}
            label='Traffic Count '
            onChange={handleChange}
            error={
              touched?.details?.traffic_count &&
              Boolean(errors?.details?.traffic_count)
            }
            helperText={
              touched?.details?.traffic_count && errors?.details?.traffic_count
            }
          />
        </Grid>
        <Grid item size={4}>
          <TextField
            fullWidth
            name='details.inclusions'
            value={values?.details?.inclusions}
            multiline
            rows={4}
            label='Inclusions'
            onChange={handleChange}
            error={
              touched?.details?.inclusions &&
              Boolean(errors?.details?.inclusions)
            }
            helperText={
              touched?.details?.inclusions && errors?.details?.inclusions
            }
          />
        </Grid>
        <Grid item size={4}>
          <TextField
            fullWidth
            name='details.discountedRate.monthly_rental_in_php'
            value={values?.details?.discountedRate?.monthly_rental_in_php}
            label='Monthly Rental (Php)'
            onChange={(e) => {
              setFieldValue(
                'details.discountedRate.monthly_rental_in_php',
                e.target.value === '' ? null : Number(e.target.value)
              );
            }}
            error={
              touched?.details?.discountedRate?.monthly_rental_in_php &&
              Boolean(errors?.details?.discountedRate?.monthly_rental_in_php)
            }
            helperText={
              touched.details?.discountedRate?.monthly_rental_in_php &&
              errors?.details?.discountedRate?.monthly_rental_in_php
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DetailsForm;
