import { create } from 'zustand';

// // Development
const BASE_URL = 'http://localhost:8044';

// Production
// const BASE_URL = "";

const useApiStore = create((set) => ({
  apiUrls: {
    //auth endpoint
    login: `${BASE_URL}/api/v1/auth/login`,
    //general endpoints
    uploadImages: `${BASE_URL}/api/v1/images/upload`,
    getAllImages: `${BASE_URL}/api/v1/images/getImages`,
    // Admin endpoints
    getAllSubmissions: `${BASE_URL}/api/v1/images/getSubmissions`,
  },
}));

export { useApiStore };
