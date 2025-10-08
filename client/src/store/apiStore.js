import { create } from 'zustand';

// // Development
// const BASE_URL = 'http://localhost:8044';

// Production
const BASE_URL = "";

const useApiStore = create((set) => ({
  apiUrls: {
    //auth endpoint
    login: `${BASE_URL}/api/v1/auth/login`,
    register: `${BASE_URL}/api/v1/auth/register`,
    logout: `${BASE_URL}/api/v1/auth/logout`,
    //general endpoints
    uploadImages: `${BASE_URL}/api/v1/images/upload`,
    getAllImages: `${BASE_URL}/api/v1/images/getImages`,
    getAllImagesByUserId: `${BASE_URL}/api/v1/images/getImagesByUserId`,
    getAllSubmissionsByUserId: `${BASE_URL}/api/v1/submissions/getSubmissionsByUserId`,
    // Admin endpoints
    getAllSubmissions: `${BASE_URL}/api/v1/submissions/getSubmissions`,
    postChangeSubmissionStatus: `${BASE_URL}/api/v1/submissions/process`,
    deleteSubmission: `${BASE_URL}/api/v1/submissions/delete`,
    rewardSubmission: `${BASE_URL}/api/v1/submissions/submitRewardHistory`,
    // OOH
    getOOH: `${BASE_URL}/api/v1/ooh`,
    createOOH: `${BASE_URL}/api/v1/ooh`,
    editOOH: `${BASE_URL}/api/v1/ooh/`,
    deleteOOH: `${BASE_URL}/api/v1/ooh`,
    getOOHDropdowns: `${BASE_URL}/api/v1/ooh/dropdowns`,
    postOOHDropdowns: `${BASE_URL}/api/v1/ooh/dropdowns`,
    deleteOOHDropdowns: `${BASE_URL}/api/v1/ooh/dropdowns`,
  },
}));

export { useApiStore };
