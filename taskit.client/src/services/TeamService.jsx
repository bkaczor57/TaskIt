import axios from 'axios';
import api from './Api'

export const createTeam = async (name,description) => {
    try {
        const response = await axios.post('/api/Team', {name,description});
        return response.data;
    } catch(error) {
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
          } else {
            throw new Error('Wystąpił błąd dodawania grupy. Spróbuj ponownie, lub odśwież stronę.');
          }
    }
};

export const getUserTeams = async () => {
    try {
        const response = await axios.get('/api/UserTeams/teams');
        return response.data;
    } catch(error) {
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
          } else {
            throw new Error('Wystąpił błąd pobierania danych. Spróbuj ponownie.');
          }
    }
    
}