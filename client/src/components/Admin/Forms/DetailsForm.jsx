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
            name='traffic'
            value={values.traffic}
            label='Traffic Details'
            onChange={handleChange}
            error={touched.traffic && Boolean(errors.traffic)}
            helperText={touched.traffic && errors.traffic}
          />
        </Grid>
        <Grid item size={4}>
          <TextField
            fullWidth
            name='inclusions'
            value={values.inclusions}
            multiline
            rows={4}
            label='Inclusions'
            onChange={handleChange}
            error={touched.inclusions && Boolean(errors.inclusions)}
            helperText={touched.inclusions && errors.inclusions}
          />
        </Grid>
        <Grid item size={4}>
          <TextField
            fullWidth
            name='monthly_rental'
            value={values?.discounted_rate?.monthly_rental_in_php}
            label='Monthly Rental (Php)'
            onChange={handleChange}
            error={
              touched.monthly_rental_in_php &&
              Boolean(errors.monthly_rental_in_php)
            }
            helperText={
              touched.monthly_rental_in_php && errors.monthly_rental_in_php
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DetailsForm;
