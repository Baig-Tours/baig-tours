import axiosClient from './axiosClient';

export const getPackages = (params) =>
  axiosClient.get('/packages', { params }).then((res) => res.data);

export const getPackageBySlug = (slug) =>
  axiosClient.get(`/packages/${slug}`).then((res) => res.data);

export const getFeaturedPackages = () =>
  axiosClient.get('/packages/featured').then((res) => res.data);

export const getAdminPackages = () =>
  axiosClient.get('/admin/packages').then((res) => res.data);

export const createPackage = (formData) =>
  axiosClient
    .post('/admin/packages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);

export const updatePackage = (id, data) =>
  axiosClient.put(`/admin/packages/${id}`, data).then((res) => res.data);

export const deletePackage = (id) =>
  axiosClient.delete(`/admin/packages/${id}`).then((res) => res.data);