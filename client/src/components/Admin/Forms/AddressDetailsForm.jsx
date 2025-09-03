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
            name='address_details.street'
            value={values.address_details.street}
            label='Street'
            onChange={handleChange}
            error={
              touched?.address_details?.street &&
              Boolean(errors?.address_details?.street)
            }
            helperText={
              touched?.address_details?.street &&
              errors?.address_details?.street
            }
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            name='address_details.city'
            value={values.address_details.city}
            label='City / Municipality'
            onChange={handleChange}
            error={
              touched?.address_details?.city &&
              Boolean(errors?.address_details?.city)
            }
            helperText={
              touched?.address_details?.city && errors?.address_details?.city
            }
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            name='address_details.province'
            value={values.address_details.province}
            label='Province'
            onChange={handleChange}
            error={
              touched?.address_details?.province &&
              Boolean(errors?.address_details?.province)
            }
            helperText={
              touched?.address_details?.province &&
              errors?.address_details?.province
            }
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            name='address_details.country'
            value={values.address_details.country}
            label='Country'
            onChange={handleChange}
            error={
              touched?.address_details?.country &&
              Boolean(errors?.address_details?.country)
            }
            helperText={
              touched?.address_details?.country &&
              errors?.address_details?.country
            }
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            name='address_details.country_code'
            value={values.address_details.country_code}
            label='Country Code'
            onChange={handleChange}
            error={
              touched?.address_details?.country_code &&
              Boolean(errors?.address_details?.country_code)
            }
            helperText={
              touched?.address_details?.country_code &&
              errors?.address_details?.country_code
            }
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            name='address_details.postalcode'
            value={values.address_details.postalcode}
            label='Postal Code'
            onChange={handleChange}
            error={
              touched?.address_details?.postalcode &&
              Boolean(errors?.address_details?.postalcode)
            }
            helperText={
              touched?.address_details?.postalcode &&
              errors?.address_details?.postalcode
            }
          />
        </Grid>

        <Grid item size={4}>
          <TextField
            fullWidth
            multiline
            rows={4}
            name='address_details.landmark'
            value={values.address_details.landmark}
            label='Landmark'
            onChange={handleChange}
            error={
              touched?.address_details?.landmark &&
              Boolean(errors?.address_details?.landmark)
            }
            helperText={
              touched?.address_details?.landmark &&
              errors?.address_details?.landmark
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AddressDetailsForm;
