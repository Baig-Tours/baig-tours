import axios from 'axios';

const API_URL = 'http://localhost:5000/api/destinations';

export const getDestinations = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getAdminDestinations = async () => {
  const response = await axios.get(`${API_URL}/admin`);
  return response.data;
};

export const createDestination = async (destinationData) => {
  const response = await axios.post(`${API_URL}/admin`, destinationData);
  return response.data;
};

export const updateDestination = async (id, destinationData) => {
  const response = await axios.put(`${API_URL}/admin/${id}`, destinationData);
  return response.data;
};

export const deleteDestination = async (id) => {
  const response = await axios.delete(`${API_URL}/admin/${id}`);
  return response.data;
};