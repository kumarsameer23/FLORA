import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor — attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('flora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('flora_token');
      localStorage.removeItem('flora_user');
      // Only redirect if not on auth pages
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ── Auth ───────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
  toggleWishlist: (productId) => API.post(`/auth/wishlist/${productId}`),
  addRecentlyViewed: (productId) => API.post(`/auth/recently-viewed/${productId}`),
};

// ── Products ───────────────────────────────────────────
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getBySlug: (slug) => API.get(`/products/${slug}`),
  getFeatured: () => API.get('/products/featured'),
  search: (q) => API.get('/products/search', { params: { q } }),
  create: (formData) => API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => API.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/products/${id}`),
};

// ── Categories ─────────────────────────────────────────
export const categoryAPI = {
  getAll: () => API.get('/categories'),
  create: (formData) => API.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => API.put(`/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/categories/${id}`),
};

// ── Reviews ────────────────────────────────────────────
export const reviewAPI = {
  getByProduct: (productId, params) => API.get(`/reviews/${productId}`, { params }),
  create: (data) => API.post('/reviews', data),
  delete: (id) => API.delete(`/reviews/${id}`),
};

// ── Orders ─────────────────────────────────────────────
export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/my'),
  getAll: (params) => API.get('/orders', { params }),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
};

// ── Contact ────────────────────────────────────────────
export const contactAPI = {
  submit: (data) => API.post('/contact', data),
  getAll: () => API.get('/contact'),
  markRead: (id) => API.put(`/contact/${id}/read`),
};

// ── Newsletter ─────────────────────────────────────────
export const newsletterAPI = {
  subscribe: (email) => API.post('/newsletter', { email }),
  getAll: () => API.get('/newsletter'),
};

// ── Admin ──────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleUser: (id) => API.put(`/admin/users/${id}/toggle`),
};

export default API;
