import API from './api';

export const submitReport = (form) =>
  API.post('/api/reports/submit', form);

export const getReports = (startDate, endDate) =>
  API.get('/api/reports', { params: { startDate, endDate } });

export const getNotifications = (userId) =>
  API.get(`/api/notifications/${userId}`);

export const deleteNotification = (id) =>
  API.delete(`/api/notifications/${id}`);
