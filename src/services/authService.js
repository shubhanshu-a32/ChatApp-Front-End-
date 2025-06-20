import api from './api';

export const registerUser = (userData) => api.post('/api/auth/register', userData);

export const loginUser = (credentials) => api.post('/api/auth/login', credentials);

export const googleLogin = (credential) => api.post('/api/auth/google', { credential });
