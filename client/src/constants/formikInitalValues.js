import * as Yup from 'yup';

export const OOH_INITIAL_VALUES = {
  company: '',
  media_type: '',
  media_format: '',
  media_status: '',
  latitude: '',
  longitude: '',
  location: '',

  address: {
    street: '',
    city: '',
    province: '',
    country: 'Philippines',
    country_code: 'PH',
    postcode: '',
    landmark: '',
  },

  dimensions: {
    width_in_ft: '',
    height_in_ft: '',
    diagonal_in_ft: '',
    radius_in_meters: '',
    facing: '',
  },

  details: {
    traffic: '',
    inclusions: '',
    traffic_count: '',
    discountedRate: {
      monthly_rental_in_php: '',
    },
  },
};

export const OOH_ValidationSchema = Yup.object().shape({
  company: Yup.string().required('Company is required'),
  media_type: Yup.string().required('Media Type is required'),
  media_format: Yup.string().required('Media Format is required'),
  media_status: Yup.string().required('Media Status is required'),

  latitude: Yup.number()
    .typeError('Latitude must be a number')
    .nullable()
    .required('Latitude is required'),

  longitude: Yup.number()
    .typeError('Longitude must be a number')
    .nullable()
    .required('Longitude is required'),

  location: Yup.string(),

  address: Yup.object().shape({
    street: Yup.string(),
    city: Yup.string(),
    province: Yup.string(),
    country: Yup.string(),
    country_code: Yup.string().length(2, 'Country code must be 2 characters'),
    landmark: Yup.string(),
    postcode: Yup.string(),
  }),

  dimensions: Yup.object().shape({
    width_in_ft: Yup.number().typeError('Width must be a number'),
    height_in_ft: Yup.number().typeError('Height must be a number'),
    diagonal_in_ft: Yup.number()

      .typeError('Diagonal must be a number'),
    radius_in_meters: Yup.number()

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
    discountedRate: Yup.object().shape({
      monthly_rental_in_php: Yup.number()
        .nullable()
        .typeError('Monthly rental must be a number'),
    }),
  }),
});
