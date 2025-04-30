import api from './Api';

const handleError = (error, context) => {
    if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
    }
    throw new Error(`Wystąpił błąd podczas ${context}. Spróbuj ponownie.`);
};

const TaskService = {


    // Get All Tasks - Admin only
    async listTasks() {
        try{
            const{data} = await api.get(`/Tasks`);
            return data;
        } catch (e) {
            handleError(e, ' pobierania wszystkich zadań');
        }
    },
    // Get Task
    async getTask(taskId) {
        try{
            const{data} = await api.get(`/Task/${taskId}`);
            return data;
        } catch (e) {
            handleError(e, ' pobierania zadania');
        }
    },
    // Get List of Team tasks
    async listTeamTasks(teamId) {
        try {
            const { data } = await api.get(`/Team/${teamId}/task`);
            return data;             
        } catch (e) {
            handleError(e, 'pobierania zadań zespołu');
        }
    },
    // Get List of Section tasks
    async listSectionTasks(teamId, sectionId, filters) {
        try {
            const { data } = await api.get(`/Team/${teamId}/section/${sectionId}/task`, { params: filters });
            return data;
        } catch (e) {
            handleError(e, 'pobierania zadań sekcji');
        }
    },
    // Create Task
    async create(teamId, sectionId, payload) {
        try {
            const { data } = await api.post(
                `/Team/${teamId}/section/${sectionId}/task`,
                payload
            );
            return data;
        } catch (e) {
            handleError(e, 'tworzenia zadania');
        }
    },

    // Update Task
    async update(taskId, payload) {
        try {
            const { data } = await api.put(`/Task/${taskId}`, payload);
            return data;
        } catch (e) {
            handleError(e, 'aktualizacji zadania');
        }
    },
    // Delete task
    async remove(taskId) {
        try {
            const { data } = await api.delete(`/Task/${taskId}`);
            return data;
        } catch (e) {
            handleError(e, 'usuwania zadania');
        }
    },
};

export default TaskService;
