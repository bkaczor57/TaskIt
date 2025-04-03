
import api from './Api'

export const createTeam = async (name,description) => {
    try {
        const response = await api.post('/Team', {name,description});
        return response.data;
    } catch(error) {
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
          } else {
            throw new Error('Wystąpił błąd dodawania grupy. Spróbuj ponownie, lub odśwież stronę.');
          }
    }
};

// Pobieranie zespołów użytkownika
export const getUserTeams = async () => {
    try {
        const response = await api.get('/UserTeam/teams');
        return response.data;
    } catch(error) {
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
          } else {
            throw new Error('Wystąpił błąd pobierania danych. Spróbuj ponownie.');
          }
    }
    
};

export const getTeamUsers = async (teamId) => {
  try {
    const response = await api.get(`/UserTeam/users/${teamId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Błąd podczas pobierania użytkowników zespołu.');
  }
};



// Pobranie zespołu po ID
export const getTeamById = async (teamId) => {
  try {
      const response = await api.get(`/Team/${teamId}`);
      return response.data;
  } catch (error) {
      handleError(error, 'pobierania danych zespołu');
  }
};

// Edycja zespołu
export const updateTeam = async (teamId, updatedData) => {
  try {
      const response = await api.put(`/Team/${teamId}`, updatedData);
      return response.data;
  } catch (error) {
      handleError(error, 'edycji zespołu');
  }
};

// Zmiana właściciela zespołu
export const changeTeamOwner = async (teamId, newOwnerId) => {
  try {
      const response = await api.put(`/Team/${teamId}/change-owner`, { newOwnerId });
      return response.data;
  } catch (error) {
      handleError(error, 'zmiany właściciela zespołu');
  }
};

// Usunięcie zespołu
export const deleteTeam = async (teamId) => {
  try {
      const response = await api.delete(`/Team/${teamId}`);
      return response.data;
  } catch (error) {
      handleError(error, 'usuwania zespołu');
  }
};

// Obsługa błędów (DRY principle)
function handleError(error, context) {
  if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
  } else {
      throw new Error(`Wystąpił błąd podczas ${context}. Spróbuj ponownie.`);
  }
};