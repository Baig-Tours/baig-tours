import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor for uniform API data extraction and error normalization
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'An unexpected network or server error occurred.',
      errors: error.response?.data?.errors || null,
      status: error.response?.status || 500,
    };
    return Promise.reject(customError);
  }
);

export default axiosClient;
