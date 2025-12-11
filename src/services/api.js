import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const masterDataAPI = {
  getBoards: () => api.get('/master/boards'),
  getMediums: () => api.get('/master/mediums'),
  getClasses: () => api.get('/master/classes'),
  getAcademicYears: () => api.get('/master/academic-years'),
  getBooks: () => api.get('/master/books'),
  create: (type, data) => api.post(`/master/${type}`, data),
  update: (type, id, data) => api.put(`/master/${type}/${id}`, data),
  delete: (type, id) => api.delete(`/master/${type}/${id}`),
};

export const bookSetAPI = {
  getAll: (params) => api.get('/book-set', { params }),
  getById: (id) => api.get(`/book-set/${id}`),
  create: (data) => api.post('/book-set/create', data),
  update: (id, data) => api.put(`/book-set/${id}`, data),
  delete: (id) => api.delete(`/book-set/${id}`),
};

export default api;
