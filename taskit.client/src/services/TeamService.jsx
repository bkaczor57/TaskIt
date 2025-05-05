import api from './Api';
import { parseApiError } from '../utils/parseApiError'; 


const TeamService = {
  async createTeam(name, description) {
    try {
      const { data } = await api.post('/Team', { name, description });
      return data;
    } catch (e) {
      throw parseApiError(e, 'tworzenia zespołu');
    }
  },

  async getTeamById(teamId) {
    try {
      const { data } = await api.get(`/Team/${teamId}`);
      return data;
    } catch (e) {
      throw parseApiError(e, 'pobierania danych zespołu');
    }
  },

  async updateTeam(teamId, payload) {
    try {
      const { data } = await api.put(`/Team/${teamId}`, payload);
      return data;
    } catch (e) {
      throw parseApiError(e, 'aktualizacji zespołu');
    }
  },

  async deleteTeam(teamId) {
    try {
      const { data } = await api.delete(`/Team/${teamId}`);
      return data;
    } catch (e) {
      throw parseApiError(e, 'usuwania zespołu');
    }
  },

  async changeTeamOwner(teamId, newOwnerId) {
    try {
      const { data } = await api.put(`/Team/${teamId}/change-owner`, {
        newOwnerId,
      });
      return data;
    } catch (e) {
      throw parseApiError(e, 'zmiany właściciela zespołu');
    }
  },
};

export default TeamService;
