import API from './api';

export const updateProfilePicture = (userId, formData) =>
  API.put(`/api/updates/update-profile-picture/${userId}`, formData);

export const updateDetails = (userId, data) =>
  API.put(`/api/updates/update-details/${userId}`, data);

export const getMunicipalEmployees = () =>
  API.get('/api/updates/municipal-emps');

export const deleteUser = (email) =>
  API.delete(`/api/users/${email}`);

export const getDepartments = () =>
  API.get('/api/updates/departments');
