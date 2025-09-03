import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';

import CompanyFirstForm from '../components/Admin/Forms/CompanyFirstForm';
import AddressDetailsForm from '../components/Admin/Forms/AddressDetailsForm';
import DimentionDetailsForm from '../components/Admin/Forms/DimentionDetailsForm';
import DetailsForm from '../components/Admin/Forms/DetailsForm';
import { postOOHSubmission } from '../helpers/postFunctions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiStore } from '../store/apiStore';
import { useMediaStore } from '../store/mediaStore';
import toast from 'react-hot-toast';

import {
  OOH_INITIAL_VALUES,
  OOH_ValidationSchema,
} from '../constants/formikInitalValues';

const AddInventory = () => {
  const apiUrls = useApiStore((state) => state.apiUrls);
  const { isLoading: storeLoading, setIsLoading } = useMediaStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) => postOOHSubmission(apiUrls.createOOH, payload),
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
  const handleInventorySubmit = async (values, { resetForm }) => {
    try {
      console.log('form submitted', values);
      // await mutation.mutateAsync(values, {
      //   onSuccess: (data) => {
      //     console.log('✅ Success:', data);
      //     toast.success(`${data.message}`);

      //     // reset the form after success
      //     resetForm();

      //     queryClient.invalidateQueries(['fetch-ooh']);
      //   },
      //   /**
      //    * Error callback when mutation fails.
      //    * @param {Error} error The error object that was thrown.
      //    */
      //   onError: (error) => {
      //     console.error('❌ Error:', error);
      //   },
      // });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={storeLoading}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </Box>
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
            initialValues={OOH_INITIAL_VALUES}
            validationSchema={OOH_ValidationSchema}
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
