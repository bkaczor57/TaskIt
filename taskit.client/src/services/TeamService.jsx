import api from './Api';

const handleError = (error, context) => {
  if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  } else {
    throw new Error(`Wystąpił błąd podczas ${context}. Spróbuj ponownie.`);
  }
};

const TeamService = {
  async createTeam(name, description) {
    try {
      const res = await api.post("/Team", { name, description });
      return res.data;
    } catch (error) {
      handleError(error, "tworzenia zespołu");
    }
  },

  async getTeamById(teamId) {
    try {
      const res = await api.get(`/Team/${teamId}`);
      return res.data;
    } catch (error) {
      handleError(error, "pobierania danych zespołu");
    }
  },

  async updateTeam(teamId, updatedData) {
    try {
      const res = await api.put(`/Team/${teamId}`, updatedData);
      return res.data;
    } catch (error) {
      handleError(error, "aktualizacji zespołu");
    }
  },

  async deleteTeam(teamId) {
    try {
      const res = await api.delete(`/Team/${teamId}`);
      return res.data;
    } catch (error) {
      handleError(error, "usuwania zespołu");
    }
  },

  async changeTeamOwner(teamId, newOwnerId) {
    try {
      const res = await api.put(`/Team/${teamId}/change-owner`, { newOwnerId });
      return res.data;
    } catch (error) {
      handleError(error, "zmiany właściciela zespołu");
    }
  }
};

export default TeamService;
