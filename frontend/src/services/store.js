import api from './api';

export const getStore = () => api.get('/store');

export const updateStore = (store) => api.put('/store', { store });
