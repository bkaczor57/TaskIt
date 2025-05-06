import api from './Api';
import { emitError } from '../context/ErrorProvider';

const handleError = (error, ctx) => {
  const msg =
    error.response?.data?.error ??
    `Wystąpił błąd podczas ${ctx}. Spróbuj ponownie.`;
  emitError(msg);
  throw new Error(msg);
};

const UserTeamService = {
  async getUserInTeam(teamId, userId) {
    try {
      const { data } = await api.get(`/UserTeam/team/${teamId}/user/${userId}`);
      return data;
    } catch (e) {
      handleError(e, 'pobierania informacji o użytkowniku');
    }
  },

  async removeUserFromTeam(teamId, userId) {
    try {
      const { data } = await api.delete(
        `/UserTeam/team/${teamId}/user/${userId}`,
      );
      return data;
    } catch (e) {
      handleError(e, 'usuwania użytkownika z grupy');
    }
  },

  async updateUserRole(teamId, userId, role) {
    try {
      const { data } = await api.put(
        `/UserTeam/team/${teamId}/user/${userId}`,
        { role },
      );
      return data;
    } catch (e) {
      handleError(e, 'aktualizacji roli użytkownika');
    }
  },

  async getUserTeams() {
    try {
      const { data } = await api.get('/UserTeam/user/teams');
      return data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle the case where no teams are found by returning an empty array
        return [];
      } else {
        // Handle other errors
        handleError(error, 'pobierania grup użytkownika');
      }
    }
  },

  async getUsersByTeamId(teamId) {
    try {
      const { data } = await api.get(`/UserTeam/team/${teamId}/users`);
      return data;
    } catch (e) {
      handleError(e, 'pobierania użytkowników grupy');
    }
  },

  async getTeamsByUserId(userId) {
    try {
      const { data } = await api.get(`/UserTeam/user/${userId}/teams`);
      return data;
    } catch (e) {
      // You might want to handle this error as well, depending on your application's needs
      console.error("Error fetching teams by user ID:", e);
      return []; // Or throw an error if necessary
    }
  },
};

export default UserTeamService;