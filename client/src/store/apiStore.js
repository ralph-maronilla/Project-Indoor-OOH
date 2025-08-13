import { create } from 'zustand';

// // Development
const BASE_URL = 'http://localhost:8044';

// Production
// const BASE_URL = "";

const useApiStore = create((set) => ({
  apiUrls: {
    login: `${BASE_URL}/api/v1/auth/login`,
    // retrieveRentalListings: `${BASE_URL}/rental-listing-scraper/api/v1/rental-listing/rental-listing`,
    uploadImages: `${BASE_URL}/api/v1/images/upload`,
    getAllImages: `${BASE_URL}/api/v1/images/getImages`,
  },
}));

export { useApiStore };
