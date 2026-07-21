import axios from 'axios';

/**
 * Shared Axios instance used across every *Api.js module (packageApi,
 * bookingApi, blogApi, etc.). withCredentials is required so the browser
 * sends the httpOnly auth cookie on every request to the API.
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Normalize error shape: every backend error already looks like
// { success: false, message, errors }. This unwraps it so callers can
// just do `catch (err) { setError(err.message) }`.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    const errors = error.response?.data?.errors || [];
    const status = error.response?.status;

    return Promise.reject({ message, errors, status });
  }
);

export default axiosClient;
