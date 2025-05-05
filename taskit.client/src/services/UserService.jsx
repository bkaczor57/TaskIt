import api from './Api'


const handleError = (error, context) => {
  let message;
  if (error.response?.data?.error) {
    message = error.response.data.error;
  } else {
    message = `Wystąpił błąd podczas ${context}.`;
  }
  emitError(message);           // globalny toast
  throw new Error(message);      // w razie potrzeby do dalszej obsługi
};



export const getCurrentUser = async () => {
  try {
    const response = await api.get('/User');
    return response.data;
  } catch (e) {
    handleError(e, 'pobierania użytkownika');
  }
};

export const updateCurrentUser = async (updateData) => {
  try {
    const response = await api.put('/User', updateData);
    return response.data;
  } catch (e) {
    handleError(e, 'aktualizacji użytkownika');
  }
};

export const deleteCurrentUser = async () => {
  try {
    await api.delete('/User');
  } catch (e) {
    handleError(e, 'usuwania użytkownika');
  }
};
