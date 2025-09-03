import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import AutocompleteCustomComponent from '../components/Admin/Forms/MediaTypeComponent';
import MediaTypeComponent from '../components/Admin/Forms/MediaTypeComponent';
import CompanyFirstForm from '../components/Admin/Forms/CompanyFirstForm';
import AddressDetailsForm from '../components/Admin/Forms/AddressDetailsForm';
import DimentionDetailsForm from '../components/Admin/Forms/DimentionDetailsForm';
import DetailsForm from '../components/Admin/Forms/DetailsForm';
const initialValues = {
  company: '',
  media_type: '',
  media_format: '',
  media_status: '',
  latitude: null,
  longitude: null,
  location: '',

  address_details: {
    street: '',
    city: '',
    province: '',
    country: 'Philippines',
    country_code: 'PH',
    postalCode: '',
    landmark: '',
  },

  dimensions: {
    width_in_ft: null,
    height_in_ft: null,
    diagonal_in_ft: null,
    radius_in_meters: null,
    facing: '',
  },
  details: {
    traffic: '',
    inclusions: null,
    traffic_count: null,
    discounted_rate: {
      monthly_rental_in_php: null,
    },
  },
};
const validationSchema = Yup.object().shape({
  company: Yup.string(),
  media_type: Yup.string(),
  media_format: Yup.string(),
  media_status: Yup.string(),
  latitude: Yup.number().typeError('Latitude must be a number').nullable(),

  longitude: Yup.number().typeError('Longitude must be a number').nullable(),

  location: Yup.string(),

  address_details: Yup.object().shape({
    street: Yup.string(),
    city: Yup.string(),
    province: Yup.string(),
    country: Yup.string(),
    country_code: Yup.string().length(2, 'Country code must be 2 characters'),

    postalCode: Yup.string(),
  }),

  dimensions: Yup.object().shape({
    width_in_ft: Yup.number().nullable().typeError('Width must be a number'),
    height_in_ft: Yup.number().nullable().typeError('Height must be a number'),
    diagonal_in_ft: Yup.number()
      .nullable()
      .typeError('Diagonal must be a number'),
    radius_in_meters: Yup.number()
      .nullable()
      .typeError('Radius must be a number'),
    facing: Yup.string().oneOf(
      ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
      'Facing must be one of N, NE, E, SE, S, SW, W, or NW'
    ),
  }),

  details: Yup.object().shape({
    traffic: Yup.string().nullable(),
    inclusions: Yup.string().nullable(),
    traffic_count: Yup.number()
      .nullable()
      .typeError('Traffic count must be a number'),
    discounted_rate: Yup.object().shape({
      monthly_rental_in_php: Yup.number()
        .nullable()
        .typeError('Monthly rental must be a number'),
    }),
  }),
});
const mediaTypes = ['LED', 'TV Installation', 'Print / Startic'];
const mediaFormats = ['Digital', 'Analog'];
const mediaStatuses = ['Active', 'Inactive', 'Maintenance', 'Reserved'];

const AddInventory = () => {
  const handleInventorySubmit = (values) => {
    console.log('form submitted', values);
  };
  return (
    <>
      <Box
        sx={{
          // display: 'flex',
          // flexDirection: 'column',
          width: `calc(100% - 240px)`,
          marginLeft: '240px',
          height: '100%',
        }}
      >
        <Typography variant='h1'>Add Inventory</Typography>
        <Box sx={{ marginTop: '50px' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleInventorySubmit}
          >
            {({ values, errors, touched, handleChange, setFieldValue }) => (
              <Form>
                <Grid container rowSpacing={{ xs: 5 }}>
                  <CompanyFirstForm
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                </Grid>
                <Grid container rowSpacing={{ xs: 5 }}>
                  <AddressDetailsForm
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                </Grid>
                <Grid container rowSpacing={{ xs: 5 }}>
                  <DimentionDetailsForm
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                </Grid>
                <Grid container rowSpacing={{ xs: 5 }}>
                  <DetailsForm
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                </Grid>
                <Grid
                  container
                  justifyContent='center'
                  sx={{ marginY: 5 }} // shorthand for spacing
                >
                  <Grid item>
                    <Button
                      type='submit'
                      variant='contained'
                      color='primary'
                      size='large'
                      sx={{ px: 5, py: 1, fontSize: '1.1rem', width: '300px' }}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
};

export default AddInventory;
