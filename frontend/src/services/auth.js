import api from './api';

export const register = (payload) => api.post('/admin/auth/register', payload);

export const login = (payload) => api.post('/admin/auth/login', payload);

export const logout = () => api.post('/admin/auth/logout');
