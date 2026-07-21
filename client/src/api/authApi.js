import axiosClient from './axiosClient';

export const loginRequest = (email, password) =>
  axiosClient.post('/auth/login', { email, password }).then((res) => res.data);

export const logoutRequest = () =>
  axiosClient.post('/auth/logout').then((res) => res.data);

export const getMeRequest = () =>
  axiosClient.get('/auth/me').then((res) => res.data);
