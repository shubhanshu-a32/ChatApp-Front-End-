import api from './api';

export const getCurrentUser = () => api.get('/api/user/me');

export const updateUserProfile = (id, updates) => api.put(`/api/user/${id}`, updates);