import api from './Api';
import qs from 'qs';
import { parseApiError } from '../utils/parseApiError';


const TaskService = {
  // Admin: lista wszystkich
  async listTasks() {
    try {
      const { data } = await api.get('/Tasks');
      return data;
    } catch (e) {
      throw parseApiError(e, 'pobierania wszystkich zadań');
    }
  },



  async getTask(taskId) {
    try {
      const { data } = await api.get(`/Task/${taskId}`);
      return data;
    } catch (e) {
      throw parseApiError(e, 'pobierania zadania');
    }
  },

  async listTeamTasks(teamId, filters) {
    try {
      const { data } = await api.get(
        `/Team/${teamId}/task`,
        { params: filters },
      );
      return data;
    } catch (e) {
      throw parseApiError(e, 'pobierania zadań zespołu');
    }
  },

  async listSectionTasks(teamId, sectionId, filters) {
    try {
      const { data } = await api.get(
        `/Team/${teamId}/section/${sectionId}/task`,
        { params: filters },
      );
      return data;
    } catch (e) {
      throw parseApiError(e, 'pobierania zadań sekcji');
    }
  },

  async listUserTasks(filters) {
    try {
      const { data } = await api.get(`/Task/user`, {
        params: filters,
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
      });
      return data;
    } catch (e) {
      throw parseApiError(e, 'pobierania zadań użytkownika');
    }
  },

  async create(teamId, sectionId, payload) {
    try {
      const { data } = await api.post(
        `/Team/${teamId}/section/${sectionId}/task`,
        payload,
      );
      return data;
    } catch (e) {
      throw parseApiError(e, 'tworzenia zadania');
    }
  },

  async update(taskId, payload) {
    try {
      const { data } = await api.put(`/Task/${taskId}`, payload);
      return data;
    } catch (e) {
      throw parseApiError(e, 'aktualizacji zadania');
    }
  },

  async remove(taskId) {
    try {
      const { data } = await api.delete(`/Task/${taskId}`);
      return data;
    } catch (e) {
      throw parseApiError(e, 'usuwania zadania');
    }
  },

  async getUserTaskCount(payload = {}) {
    try {
      const { data } = await api.get('/Task/user/count', {
        params: payload,
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
      });
      return data;
    } catch (e) {
      throw parseApiError(e, 'pobierania statystyk zadań użytkownika');
    }
  },
};

export default TaskService;
