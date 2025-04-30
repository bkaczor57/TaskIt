import api from './Api';

const handleError = (error, context) => {
    if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
    }
    throw new Error(`Wystąpił błąd podczas ${context}. Spróbuj ponownie.`);
};


const SectionService = {

    async get(teamId, sectionId) {
        try {
            const { data } = await api.get(`/Team/${teamId}/section/${sectionId}`)
            return data;
        } catch (e) {
            handleError(e, 'pobierania konkrenej sekcji');
        }
    },


    async list(teamId) {
        try {
            const { data } = await api.get(`/Team/${teamId}/section`);
            return data;
        } catch (e) {
            handleError(e, 'pobierania sekcji');
        }
    },

    async create(teamId, title) {
        try {
            const { data } = await api.post(`/Team/${teamId}/section`, { title });
            return data;
        } catch (e) {
            handleError(e, 'tworzenia sekcji');
        }
    },

    async update(teamId, sectionId, payload) {
        try {
            const { data } = await api.put(
                `/Team/${teamId}/section/${sectionId}`,
                payload
            );
            return data;
        } catch (e) {
            handleError(e, 'aktualizacji sekcji');
        }
    },

    async remove(teamId, sectionId) {
        try {
            const { data } = await api.delete(
                `/Team/${teamId}/section/${sectionId}`
            );
            return data;
        } catch (e) {
            handleError(e, 'usuwania sekcji');
        }
    },
};

export default SectionService;
