import api from './Api';
import { parseApiError } from '../utils/parseApiError'; 

const SectionService = {
  async get(teamId, sectionId) {
    try {
      const { data } = await api.get(`/Team/${teamId}/section/${sectionId}`);
      return data;
    } catch (e) {
      throw parseApiError(e, 'pobierania konkretnej sekcji');
    }
  },

  async list(teamId) {
    try {
      const { data } = await api.get(`/Team/${teamId}/section`);
      return data;
    } catch (e) {
      throw parseApiError(e, 'pobierania sekcji');
    }
  },

  async create(teamId, title) {
    try {
      const { data } = await api.post(`/Team/${teamId}/section`, { title });
      return data;
    } catch (e) {
      throw parseApiError(e, 'tworzenia sekcji');
    }
  },

  async update(teamId, sectionId, payload) {
    try {
      const { data } = await api.put(`/Team/${teamId}/section/${sectionId}`, payload);
      return data;
    } catch (e) {
      throw parseApiError(e, 'aktualizacji sekcji');
    }
  },

  async remove(teamId, sectionId) {
    try {
      const { data } = await api.delete(`/Team/${teamId}/section/${sectionId}`);
      return data;
    } catch (e) {
      throw parseApiError(e, 'usuwania sekcji');
    }
  },

  async move(teamId, sectionId, newPosition) {
    try {
      const { data } = await api.put(
        `/Team/${teamId}/section/${sectionId}/move`,
        { newPosition }, 
      );
      return data;
    } catch (e) {
      throw parseApiError(e, 'przesuwania sekcji');
    }
  },
};

export default SectionService;