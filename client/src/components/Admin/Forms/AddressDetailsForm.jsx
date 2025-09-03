import { Grid, TextField, Typography } from '@mui/material';
import React from 'react';
import MediaTypeComponent from './MediaTypeComponent';

const AddressDetailsForm = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
}) => {
  return (
    <>
      <Typography variant='h3' sx={{ fontSize: '16px', marginTop: '20px' }}>
        Address Details
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
            name='address.street'
            value={values.address.street}
            label='Street'
            onChange={handleChange}
            error={touched?.address?.street && Boolean(errors?.address?.street)}
            helperText={touched?.address?.street && errors?.address?.street}
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            name='address.city'
            value={values.address.city}
            label='City / Municipality'
            onChange={handleChange}
            error={touched?.address?.city && Boolean(errors?.address?.city)}
            helperText={touched?.address?.city && errors?.address?.city}
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            name='address.province'
            value={values.address.province}
            label='Province'
            onChange={handleChange}
            error={
              touched?.address?.province && Boolean(errors?.address?.province)
            }
            helperText={touched?.address?.province && errors?.address?.province}
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            name='address.country'
            value={values.address.country}
            label='Country'
            onChange={handleChange}
            error={
              touched?.address?.country && Boolean(errors?.address?.country)
            }
            helperText={touched?.address?.country && errors?.address?.country}
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            name='address.country_code'
            value={values.address.country_code}
            label='Country Code'
            onChange={handleChange}
            error={
              touched?.address?.country_code &&
              Boolean(errors?.address?.country_code)
            }
            helperText={
              touched?.address?.country_code && errors?.address?.country_code
            }
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            name='address.postcode'
            value={values.address.postcode}
            label='Postal Code'
            onChange={handleChange}
            error={
              touched?.address?.postcode && Boolean(errors?.address?.postcode)
            }
            helperText={touched?.address?.postcode && errors?.address?.postcode}
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            multiline
            rows={4}
            name='address.landmark'
            value={values?.address.landmark}
            label='Landmark'
            onChange={handleChange}
            error={
              touched?.address?.landmark && Boolean(errors?.address?.landmark)
            }
            helperText={touched?.address?.landmark && errors?.address?.landmark}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AddressDetailsForm;
