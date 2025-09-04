import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import { Formik, Form } from 'formik';
import toast from 'react-hot-toast';
import {
  OOH_INITIAL_VALUES,
  OOH_ValidationSchema,
} from '../../../constants/formikInitalValues';
import CompanyFirstForm from '../../../components/Admin/Forms/CompanyFirstForm';
import AddressDetailsForm from '../../../components/Admin/Forms/AddressDetailsForm';
import DimentionDetailsForm from '../../../components/Admin/Forms/DimentionDetailsForm';
import DetailsForm from '../../../components/Admin/Forms/DetailsForm';
import { getInitialOOHValues } from '../../../helpers/formikHelpers';
import { useApiStore } from '../../../store/apiStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMediaStore } from '../../../store/mediaStore';
import { editOOHSubmission } from '../../../helpers/postFunctions';

const OOHEditForm = ({ data, handleCloseDialog }) => {
  const initialValues = getInitialOOHValues(data);
  const apiUrls = useApiStore((state) => state.apiUrls);
  const { isLoading: storeLoading, setIsLoading } = useMediaStore();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, payload }) =>
      editOOHSubmission(apiUrls.editOOH, id, payload),
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
      handleCloseDialog();
    },
    onSuccess: (data) => {
      console.log('✅ Edit Success:', data);
      toast.success(`${data.message}`);
      queryClient.invalidateQueries(['fetch-ooh']); // refresh OOH list
    },
    onError: (error) => {
      console.error('❌ Edit Error:', error);
      toast.error('Failed to update inventory');
    },
  });

  const handleEditSubmit = async (values) => {
    try {
      console.log('editing...', values);
      await mutation.mutateAsync({ id: data.id, payload: values });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={storeLoading}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </Box>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={OOH_ValidationSchema}
        onSubmit={handleEditSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form>
            <Grid container rowSpacing={{ xs: 5 }} marginTop={5}>
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

            <Grid container justifyContent='center' sx={{ marginY: 5 }}>
              <Grid item>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  size='large'
                  sx={{ px: 5, py: 1, fontSize: '1.1rem', width: '300px' }}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default OOHEditForm;
