import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export const carService = {
  getAll: (params) => api.get('/cars', { params }),
  getById: (id) => api.get(`/cars/${id}`),
  create: (data) => api.post('/cars', data),
  update: (id, data) => api.put(`/cars/${id}`, data),
  delete: (id) => api.delete(`/cars/${id}`),
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getAll: () => api.get('/bookings'),
  getStats: () => api.get('/bookings/stats'),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export const authService = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export default api;
