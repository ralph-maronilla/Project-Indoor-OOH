import { OOH_INITIAL_VALUES } from '../constants/formikInitalValues';

export const getInitialOOHValues = (data) => {
  if (!data) return OOH_INITIAL_VALUES;

  return {
    ...OOH_INITIAL_VALUES,
    id: data.id || '',
    company: data.company || '',
    media_type: data.mediaType || '',
    media_format: data.mediaFormat || '',
    media_status: data.mediaStatus || '',
    latitude: data.latitude || '',
    longitude: data.longitude || '',
    location: data.location || '',

    address: {
      ...OOH_INITIAL_VALUES.address,
      street: data.address_details?.street || '',
      city: data.address_details?.city || '',
      province: data.address_details?.province || '',
      country: data.address_details?.country || 'Philippines',
      country_code: data.address_details?.countryCode || 'PH',
      postcode: data.address_details?.postcode || '',
      landmark: data.address_details?.landmark || '',
    },

    dimensions: {
      ...OOH_INITIAL_VALUES.dimensions,
      width_in_ft: data.dimensions?.widthInFt || '',
      height_in_ft: data.dimensions?.heightInFt || '',
      diagonal_in_ft: data.dimensions?.diagonalInFt || '',
      radius_in_meters: data.dimensions?.radiusInMeters || '',
      facing: data.dimensions?.facing || '',
    },

    details: {
      ...OOH_INITIAL_VALUES.details,
      traffic: data.details?.traffic || '',
      inclusions: data.details?.inclusions || '',
      traffic_count: data.details?.trafficCount || '',
      discountedRate: {
        monthly_rental_in_php:
          data.details?.discountedRate?.monthlyRentalInPhp || '',
      },
    },
  };
};
