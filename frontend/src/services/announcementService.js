import API from './api';

export const getAnnouncements = () =>
  API.get('/api/announcements');

export const createAnnouncement = (title, message) =>
  API.post('/api/announcements', { title, message });
