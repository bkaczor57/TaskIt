import axios from 'axios';

const handleError = (error, context) => {
  if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  }
  throw new Error(`Błąd podczas ${context}.`);
};

const EnumService = {
  async getTaskPriorities() {
    try {
      const { data } = await axios.get('/api/Enums/taskPriority');
      return data;
    } catch (e) {
      handleError(e, 'pobierania priorytetów zadań');
    }
  },

  async getTaskStatuses() {
    try {
      const { data } = await axios.get('/api/Enums/taskStatus');
      return data;
    } catch (e) {
      handleError(e, 'pobierania statusów zadań');
    }
  },

  async getTaskOrderBy() {
    try {
      const { data } = await axios.get('/api/Enums/taskOrderBy');
      return data;
    } catch (e) {
      handleError(e, 'pobierania opcji sortowania zadań');
    }
  },

  async getUserRoles() {
    try {
      const { data } = await axios.get('/api/Enums/userRoles');
      return data;
    } catch (e) {
      handleError(e, 'pobierania ról użytkownika');
    }
  },

  async getUserTeamRoles() {
    try {
      const { data } = await axios.get('/api/Enums/userTeamRoles');
      return data;
    } catch (e) {
      handleError(e, 'pobierania ról zespołowych');
    }
  },

  async getInviteStatuses() {
    try {
      const { data } = await axios.get('/api/Enums/inviteStatus');
      return data;
    } catch (e) {
      handleError(e, 'pobierania statusów zaproszeń');
    }
  },

  async getNotificationTypes() {
    try {
      const { data } = await axios.get('/api/Enums/notificationType');
      return data;
    } catch (e) {
      handleError(e, 'pobierania typów powiadomień');
    }
  }
};

export default EnumService;
