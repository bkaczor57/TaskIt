import React, { createContext, useState, useCallback, useContext } from 'react';
import TeamService from '../services/TeamService';
import UserTeamContext from './UserTeamContext';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [createTeamResult, setCreateTeamResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);
  const { fetchUserTeams } = useContext(UserTeamContext);

  const createTeam = async (name, description) => {
    try {
      const team = await TeamService.createTeam(name, description);
      setCreateTeamResult(team);
      setApiError(null);
      return team;
    } catch (error) {
      setApiError(error.message);
      setCreateTeamResult(null);
      throw error;
    }
  };

  const getTeamById = useCallback(async (teamId) => {
    try {
      const team = await TeamService.getTeamById(teamId);
      return team;
    } catch (error) {
      setApiError(error.message);
      throw error;
    }
  }, []);

  const updateTeam = async (teamId, updatedData) => {
    try {
      const team = await TeamService.updateTeam(teamId, updatedData);
      await fetchUserTeams(); 
      return team; 
    } catch (error) {
      setApiError(error.message);
      throw error;
    }
  };

  const deleteTeam = async (teamId) => {
    try {
      await TeamService.deleteTeam(teamId);
      await fetchUserTeams(); 
    } catch (error) {
      setApiError(error.message);
      throw error;
    }
  };

  const changeTeamOwner = async (teamId, newOwnerId) => {
    try {
      const updated = await TeamService.changeTeamOwner(teamId, newOwnerId);
      return updated;
    } catch (error) {
      setApiError(error.message);
      throw error;
    }
  };

  const clearApiError = () => {
    setApiError(null);
    setCreateTeamResult(null);
  };

  return (
    <TeamContext.Provider
      value={{
        currentTeam,
        setCurrentTeam,
        createTeam,
        createTeamResult,
        getTeamById,
        updateTeam,
        deleteTeam,
        changeTeamOwner,
        apiError,
        clearApiError
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};

export default TeamContext;
