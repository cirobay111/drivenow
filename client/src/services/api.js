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
      localStorage.removeItem('admin_session');
      // Redirect to login if we're in the admin area
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const carService = {
  getAll: (params) => api.get('/cars', { params }),
  getById: (id) => api.get(`/cars/${id}`),
  checkAvailability: (id, pickup_date, return_date) =>
    api.get(`/cars/${id}/availability`, { params: { pickup_date, return_date } }),
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
  changePassword: (data) => api.put('/auth/change-password', data),
};

export default api;
