import API from './api';

export const login = (data) =>
  API.post('/api/auth/login', data);

export const registerResident = (data) =>
  API.post('/api/auth/register/resident', data);

export const registerEmployee = (data) =>
  API.post('/api/auth/register/municipal-employer', data);

export const registerAdmin = (data) =>
  API.post('/api/auth/register/admin', data);

export const forgotPassword = (email) =>
  API.post('/api/auth/forgot-password', { email });

export const resetPassword = (token, password) =>
  API.post('/api/auth/reset-password', { token, password });

export const verifyOtp = (email, otp) =>
  API.post(`/api/auth/verify-otp/${email}`, { otp });

export const resendOtp = (email) =>
  API.post(`/api/auth/resend-otp/${email}`);
