import api from './Api';
import { parseApiError } from '../utils/parseApiError'; 


export const TeamInviteService = {
  async createInvite(teamId, email, role) {
    try {
      const { data } = await api.post('/TeamInvite', {
        teamId,
        invitedUserEmail: email,
        teamRole: role,
      });
      return data;
    } catch (e) {
      throw parseApiError(e, 'tworzenia');
    }
  },

  async getUserInvites(page = 1, pageSize = 5, status = 'All') {
    try {
      const { data } = await api.get('/TeamInvite/user-paged', {
        params: { pageNumber: page, pageSize, status },
      });
      return data;
    } catch (e) {
      throw parseApiError(e, 'pobierania');
    }
  },

  async getTeamInvites(teamId, page = 1, pageSize = 5, status = 'All') {
    try {
      const { data } = await api.get(`/TeamInvite/team/${teamId}`, {
        params: { pageNumber: page, pageSize, status },
      });
      return data;
    } catch (e) {
      throw parseApiError(e, 'pobierania');
    }
  },

  async getInviteById(inviteId) {
    try {
      const { data } = await api.get(`/TeamInvite/${inviteId}`);
      return data;
    } catch (e) {
      throw parseApiError(e, 'pobierania');
    }
  },

  async acceptInvite(inviteId) {
    try {
      const { data } = await api.put(`/TeamInvite/${inviteId}/accept`);
      return data;
    } catch (e) {
      throw parseApiError(e, 'akceptacji');
    }
  },

  async declineInvite(inviteId) {
    try {
      const { data } = await api.put(`/TeamInvite/${inviteId}/decline`);
      return data;
    } catch (e) {
      throw parseApiError(e, 'odrzucenia');
    }
  },

  async deleteInvite(inviteId) {
    try {
      const { data } = await api.delete(`/TeamInvite/${inviteId}`);
      return data;
    } catch (e) {
      throw parseApiError(e, 'usuwania');
    }
  },

  async getUserTeamRoles() {
    try {
      const { data } = await api.get('/Enums/userTeamRoles');
      return data;
    } catch (e) {
      throw parseApiError(e, 'pobierania');
    }
  },
};
