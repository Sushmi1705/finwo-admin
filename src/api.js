import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle 401
// Response interceptor removed as per user request
// api.interceptors.response.use(...)

export const fetchCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const fetchShops = () => api.get('/shops');
export const fetchShopById = (id) => api.get(`/shops/${id}`);
export const createShop = (data) => api.post('/shops', data);
export const updateShop = (id, data) => api.put(`/shops/${id}`, data);
export const deleteShop = (id) => api.delete(`/shops/${id}`);

export const fetchMenusByShop = (shopId) => api.get(`/menus/shop/${shopId}`);
export const createMenu = (data) => api.post('/menus', data);
export const updateMenu = (id, data) => api.put(`/menus/${id}`, data);
export const deleteMenu = (id) => api.delete(`/menus/${id}`);

export default api;
