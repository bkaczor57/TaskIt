import api from './Api';

export const TeamInviteService = {
  createInvite: async (teamId, email, role) => {
    try {
      const response = await api.post(`/TeamInvite`, {
        teamId,
        invitedUserEmail: email,
        teamRole: role
      });
      return response.data;
    } catch (error) {
      const apiError = error.response?.data?.error;
      throw `Wystąpił błąd podczas wysyłania zaproszenia${apiError ? `: ${apiError}` : ''}`;
    }
  },

  getUserInvites: async () => {
    try {
      const response = await api.get(`/TeamInvite/user`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data?.error;
      throw `Wystąpił błąd podczas pobierania zaproszeń${apiError ? `: ${apiError}` : ''}`;
    }
  },

  getTeamInvites: async (teamId) => {
    try {
      const response = await api.get(`/TeamInvite/team/${teamId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data?.error;
      throw `Wystąpił błąd podczas pobierania zaproszeń grupy${apiError ? `: ${apiError}` : ''}`;
    }
  },

  acceptInvite: async (inviteId) => {
    try {
      const response = await api.put(`/TeamInvite/${inviteId}/accept`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data?.error;
      throw `Wystąpił błąd podczas akceptowania zaproszenia${apiError ? `: ${apiError}` : ''}`;
    }
  },

  declineInvite: async (inviteId) => {
    try {
      const response = await api.put(`/TeamInvite/${inviteId}/decline`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data?.error;
      throw `Wystąpił błąd podczas odrzucania zaproszenia${apiError ? `: ${apiError}` : ''}`;
    }
  },

  deleteInvite: async (inviteId) => {
    try {
      const response = await api.delete(`/TeamInvite/${inviteId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data?.error;
      throw `Wystąpił błąd podczas usuwania zaproszenia${apiError ? `: ${apiError}` : ''}`;
    }
  },

  getUserTeamRoles: async () => {
    try {
      const response = await api.get(`/Enums/userTeamRoles`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data?.error;
      throw `Wystąpił błąd podczas pobierania ról użytkownika${apiError ? `: ${apiError}` : ''}`;
    }
  }
};
