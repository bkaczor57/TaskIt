import api from './Api'; // zakładam, że Api.jsx eksportuje skonfigurowany axios

const UserTeamService = {
  async getUserTeams() {
    try {
      const res = await api.get("/UserTeam/teams");
      return res.data;
    } catch (error) {
      console.error("Błąd przy pobieraniu zespołów użytkownika:", error);
      throw error;
    }
  },

  async getUsersByTeamId(teamId) {
    try {
      const res = await api.get(`/UserTeam/users/${teamId}`);
      return res.data;
    } catch (error) {
      console.error("Błąd przy pobieraniu użytkowników zespołu:", error);
      throw error;
    }
  },

  async addUserToTeam({ teamId, userId, role }) {
    try {
      const res = await api.post("/UserTeam", {
        teamId,
        userId,
        role
      });
      return res.data;
    } catch (error) {
      console.error("Błąd przy dodawaniu użytkownika do zespołu:", error);
      throw error;
    }
  },

  async removeUserFromTeam(teamId, userId) {
    try {
      const res = await api.delete(`/UserTeam/${teamId}/${userId}`);
      return res.data;
    } catch (error) {
      console.error("Błąd przy usuwaniu użytkownika z zespołu:", error);
      throw error;
    }
  },

  async updateUserRole(teamId, userId, role) {
    try {
      const res = await api.put(`/UserTeam/${teamId}/${userId}`, {
        role
      });
      return res.data;
    } catch (error) {
      console.error("Błąd przy aktualizacji roli użytkownika:", error);
      throw error;
    }
  }
};

export default UserTeamService;
