import React, { createContext, useState, useContext, useCallback } from 'react';
import { TeamInviteService } from '../services/TeamInviteService';

const TeamInviteContext = createContext();

export const useTeamInvite = () => {
  const context = useContext(TeamInviteContext);
  if (!context) {
    throw new Error('useTeamInvite must be used within a TeamInviteProvider');
  }
  return context;
};

export const TeamInviteProvider = ({ children }) => {
  const [userRoles, setUserRoles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchUserRoles = useCallback(async () => {
    try {
      const roles = await TeamInviteService.getUserTeamRoles();
      setUserRoles(roles);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const createInvite = useCallback(async (teamId, email, role) => {
    try {
      const result = await TeamInviteService.createInvite(teamId, email, role);
      setSuccess('Zaproszenie zostało wysłane pomyślnie');
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      setSuccess(null);
      throw err;
    }
  }, []);

  const getUserInvites = useCallback(async () => {
    try {
      const invites = await TeamInviteService.getUserInvites();
      setError(null);
      return invites;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const getTeamInvites = useCallback(async (teamId) => {
    try {
      const invites = await TeamInviteService.getTeamInvites(teamId);
      setError(null);
      return invites;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const acceptInvite = useCallback(async (inviteId) => {
    try {
      const result = await TeamInviteService.acceptInvite(inviteId);
      setSuccess('Zaproszenie zostało zaakceptowane');
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      setSuccess(null);
      throw err;
    }
  }, []);

  const declineInvite = useCallback(async (inviteId) => {
    try {
      const result = await TeamInviteService.declineInvite(inviteId);
      setSuccess('Zaproszenie zostało odrzucone');
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      setSuccess(null);
      throw err;
    }
  }, []);

  const deleteInvite = useCallback(async (inviteId) => {
    try {
      const result = await TeamInviteService.deleteInvite(inviteId);
      setSuccess('Zaproszenie zostało usunięte');
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      setSuccess(null);
      throw err;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const value = {
    userRoles,
    error,
    success,
    fetchUserRoles,
    createInvite,
    getUserInvites,
    getTeamInvites,
    acceptInvite,
    declineInvite,
    deleteInvite,
    clearMessages
  };

  return (
    <TeamInviteContext.Provider value={value}>
      {children}
    </TeamInviteContext.Provider>
  );
}; 