import axios from 'axios';
import config from '../config.json';

const localBaseUrl = `http://localhost:${config.BACKEND_PORT || 5005}`;

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || localBaseUrl,
});

api.interceptors.request.use((requestConfig) => {
  const token = localStorage.getItem('token');

  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  return requestConfig;
});

export default api;
