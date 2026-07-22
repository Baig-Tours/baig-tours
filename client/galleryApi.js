import axios from 'axios';

const API_URL = 'http://localhost:5000/api/gallery';

export const getGalleryItems = async (category = 'All') => {
  const response = await axios.get(`${API_URL}?category=${category}`);
  return response.data;
};

export const createGalleryItem = async (itemData) => {
  const response = await axios.post(`${API_URL}/admin`, itemData);
  return response.data;
};

export const deleteGalleryItem = async (id) => {
  const response = await axios.delete(`${API_URL}/admin/${id}`);
  return response.data;
};