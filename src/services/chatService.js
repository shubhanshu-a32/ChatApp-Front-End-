import api from './api';

export const getRecentMessages = () => api.get('/api/chat/recent');

export const sendMessageToServer = (data) => api.post('/api/chat/send', data);