import axios from 'axios';
import api from './Api'



export const loginUser = async (email, password) => {
    try {
      const response = await axios.post('/api/Auth/login', { email, password });
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Wystąpił błąd logowania. Spróbuj ponownie.');
      }
    }
  };

  export const registerUser = async (userData) => {
    try {
      const response = await axios.post('/api/Auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Wystąpił nieoczekiwany błąd podczas rejestracji.');
      }
    }
  };


  export const refreshToken = async (refreshToken) => {
    const response = await axios.post('/api/Auth/refresh', refreshToken);
    return response.data;
  };

  export const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await api.post('/Auth/change-password', {
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Wystąpił błąd podczas zmiany hasła.');
      }
    }
  };