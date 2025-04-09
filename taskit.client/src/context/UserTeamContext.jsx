import { createContext, useContext, useState, useCallback } from "react";
import UserContext from "./UserContext";
import UserTeamService from "../services/UserTeamService";

const UserTeamContext = createContext();

export const UserTeamProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const [userTeams, setUserTeams] = useState([]);
  const [teamUsers, setTeamUsers] = useState([]);

  const fetchUserTeams = useCallback(async () => {
    try {
      const teams = await UserTeamService.getUserTeams();
      setUserTeams(teams);
    } catch (err) {
      console.error("Błąd przy fetchUserTeams:", err);
    }
  }, []);

  const fetchTeamUsers = useCallback(async (teamId) => {
    try {
      const users = await UserTeamService.getUsersByTeamId(teamId);
      setTeamUsers(users);
    } catch (err) {
      console.error("Błąd przy fetchTeamUsers:", err);
    }
  }, []);

  const getUserInTeam = useCallback(async (teamId, userId) => {
    try {
      return await UserTeamService.getUserInTeam(teamId, userId);
    } catch (err) {
      console.error("Błąd przy getUserInTeam:", err);
      throw err;
    }
  }, []);

  const addUserToTeam = async (teamId, userId, role) => {
    try {
      return await UserTeamService.addUserToTeam({ teamId, userId, role });
    } catch (err) {
      console.error("Błąd przy addUserToTeam:", err);
      throw err;
    }
  };

  const removeUserFromTeam = async (teamId, userId) => {
    try {
      return await UserTeamService.removeUserFromTeam(teamId, userId);
    } catch (err) {
      console.error("Błąd przy removeUserFromTeam:", err);
      throw err;
    }
  };

  const updateUserRole = async (teamId, userId, newRole) => {
    try {
      return await UserTeamService.updateUserRole(teamId, userId, newRole);
    } catch (err) {
      console.error("Błąd przy updateUserRole:", err);
      throw err;
    }
  };

  return (
    <UserTeamContext.Provider
      value={{
        userTeams,
        teamUsers,
        fetchUserTeams,
        fetchTeamUsers,
        getUserInTeam,
        addUserToTeam,
        removeUserFromTeam,
        updateUserRole,
      }}
    >
      {children}
    </UserTeamContext.Provider>
  );
};

export const useUserTeam = () => useContext(UserTeamContext);

export default UserTeamContext;
