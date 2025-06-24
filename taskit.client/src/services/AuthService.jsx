import axios from 'axios';
import api from './Api';
import { parseApiError } from '../utils/parseApiError';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/api/Auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw parseApiError(error, 'logowania');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/api/Auth/register', userData);
    return response.data;
  } catch (error) {
    throw parseApiError(error, 'rejestracji');
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await axios.post('/api/Auth/refresh', refreshToken);
    return response.data;
  } catch (error) {
    throw parseApiError(error, 'odświeżania tokenu');
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.post('/Auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw parseApiError(error, 'zmiany hasła');
  }
};
