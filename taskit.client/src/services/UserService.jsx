import api from './Api'

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/User');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateCurrentUser = async (updateData) => {
  try {
    const response = await api.put('/User', updateData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteCurrentUser = async () => {
  try {
    await api.delete('/User');
  } catch (error) {
    handleApiError(error);
  }
};

const handleApiError = (error) => {
  if (error.response && error.response.data && error.response.data.error) {
    throw new Error(error.response.data.error); // komunikant błędu z backendu
  } else {
    throw new Error('Wystąpił nieoczekiwany błąd podczas komunikacji z serwerem.');
  }
};