import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React from 'react';
import MediaTypeComponent from './MediaTypeComponent';
import MediaFormatComponent from './MediaFormatComponent';

const CompanyFirstForm = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
}) => {
  return (
    <>
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
            name='company'
            value={values.company}
            label='Company'
            onChange={handleChange}
            error={touched.company && Boolean(errors.company)}
            helperText={touched.company && errors.company}
          />
        </Grid>
        <Grid item size={4}>
          <MediaTypeComponent
            values={values}
            errors={errors}
            touched={touched}
            handleBlur={handleChange}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
          />
        </Grid>
        <Grid item size={4}>
          <MediaFormatComponent
            values={values}
            errors={errors}
            touched={touched}
            handleBlur={handleChange}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
          />
        </Grid>
        <Grid item size={4}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Media Status</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={values.media_status}
              label='Media Status'
              onChange={handleChange}
              name='media_status'
              error={touched.media_status && Boolean(errors.media_status)}
              helperText={touched.media_status && errors.media_status}
            >
              <MenuItem value={'Active'}>Active</MenuItem>
              <MenuItem value={'Inactive'}>Inactive</MenuItem>
              <MenuItem value={'Decommissioned'}>Decommissioned</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item size={4}>
          <TextField
            fullWidth
            name='Latitude'
            value={values.latitude}
            label='Latitude'
            onChange={handleChange}
            error={touched.latitude && Boolean(errors.latitude)}
            helperText={touched.latitude && errors.latitude}
          />
        </Grid>
        <Grid item size={4}>
          <TextField
            fullWidth
            name='longitude'
            value={values.longitude}
            label='Longitude'
            onChange={handleChange}
            error={touched.longitude && Boolean(errors.longitude)}
            helperText={touched.longitude && errors.longitude}
          />
        </Grid>
        <Grid item size={4}>
          <TextField
            fullWidth
            name='location'
            value={values.location}
            label='Location'
            onChange={handleChange}
            error={touched.location && Boolean(errors.location)}
            helperText={touched.location && errors.location}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CompanyFirstForm;
