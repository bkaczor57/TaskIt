import React, { createContext, useState } from 'react';
import {
  createTeam,
  getUserTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  changeTeamOwner,
  getTeamUsers
} from '../services/TeamService';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
    
  const [teamUsers, setTeamUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [createTeamResult, setCreateTeamResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  const fetchUserTeams = async () => {
    try {
      const data = await getUserTeams();
      setTeams(data);
    } catch (error) {
      setApiError(error.message);
    }
  };

  const fetchTeamUsers = async (teamId) => {
    try {
      const data = await getTeamUsers(teamId);
      setTeamUsers(data);
    } catch (error) {
      console.error("Błąd podczas pobierania użytkowników zespołu:", error.message);
      setTeamUsers([]); 
    }
  };

  const handleCreateTeam = async (name, description) => {
    try {
      const created = await createTeam(name, description);
      setCreateTeamResult(created.name); // możesz przekazać cały obiekt, jeśli chcesz
      setApiError(null);
      await fetchUserTeams(); // odśwież dane
    } catch (error) {
      setApiError(error.message);
      setCreateTeamResult(null);
    }
  };

  const clearApiError = () => {
    setApiError(null);
    setCreateTeamResult(null);
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        fetchUserTeams,
        teamUsers,
        fetchTeamUsers,
        createTeam: handleCreateTeam,
        createTeamResult,
        apiError,
        clearApiError,
        getTeamById,
        updateTeam,
        deleteTeam,
        changeTeamOwner,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export default TeamContext;
