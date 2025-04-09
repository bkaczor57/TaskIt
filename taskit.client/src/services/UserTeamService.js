import api from './Api';

const UserTeamService = {
  getUserInTeam: async (teamId, userId) => {
    try {
      const response = await api.get(`/UserTeam/team/${teamId}/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Wystąpił błąd podczas pobierania informacji o użytkowniku';
    }
  },

  removeUserFromTeam: async (teamId, userId) => {
    try {
      const response = await api.delete(`/UserTeam/team/${teamId}/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Wystąpił błąd podczas usuwania użytkownika z grupy';
    }
  },
  
  updateUserRole: async (teamId, userId, newRole) => {
    try {
      const response = await api.put(`/UserTeam/team/${teamId}/user/${userId}`, { role: newRole });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Wystąpił błąd podczas aktualizacji roli użytkownika';
    }
  },
  
  getUserTeams: async () => {
    try {
      const response = await api.get('/UserTeam/user/teams');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Wystąpił błąd podczas pobierania grup użytkownika';
    }
  },
  
  getUsersByTeamId: async (teamId) => {
    try {
      const response = await api.get(`/UserTeam/team/${teamId}/users`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Wystąpił błąd podczas pobierania użytkowników grupy';
    }
  },

  getTeamsByUserId: async (userId) => {
    try {
      const response = await api.get(`/UserTeam/user/${userId}/teams`);
      return response.data;
    } catch (error){
      throw error.response?.data?.error || 'Wystąpił błąd podczas pobierania grup użytkownika';
    }
    
  }

};

export default UserTeamService; 