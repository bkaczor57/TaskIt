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
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvites, setTotalInvites] = useState(0);
  const [invites, setInvites] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(false);

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

  const getUserInvites = useCallback(async (page = 1, pageSize = 5, status = "All") => {
    setLoading(true);
    try {
      const response = await TeamInviteService.getUserInvites(page, pageSize, status);
      setError(null);
      setCurrentPage(page);
      setTotalPages(response.totalPages || 1);
      setTotalInvites(response.totalCount || 0);
      setInvites(response.items || []);
      setSelectedStatus(status);
      return response.items || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeamInvites = useCallback(async (teamId, page = 1, pageSize = 5, status = "All") => {
    setLoading(true);
    try {
      const response = await TeamInviteService.getTeamInvites(teamId, page, pageSize, status);
      setError(null);
      setCurrentPage(page);
      setTotalPages(response.totalPages || 1);
      setTotalInvites(response.totalItems || 0);
      setInvites(response.items || []);
      setSelectedStatus(status);
      return response.items || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInviteById = useCallback(async (inviteId) => {
    setLoading(true);
    try {
      const invite = await TeamInviteService.getInviteById(inviteId);
      setError(null);
      return invite;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptInvite = useCallback(async (inviteId) => {
    setLoading(true);
    try {
      const result = await TeamInviteService.acceptInvite(inviteId);
      setSuccess('Zaproszenie zostało zaakceptowane');
      setError(null);
      // Odśwież listę zaproszeń po akceptacji
      getUserInvites(currentPage, 5, selectedStatus);
      return result;
    } catch (err) {
      setError(err.message);
      setSuccess(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedStatus, getUserInvites]);

  const declineInvite = useCallback(async (inviteId) => {
    setLoading(true);
    try {
      const result = await TeamInviteService.declineInvite(inviteId);
      setSuccess('Zaproszenie zostało odrzucone');
      setError(null);
      // Odśwież listę zaproszeń po odrzuceniu
      getUserInvites(currentPage, 5, selectedStatus);
      return result;
    } catch (err) {
      setError(err.message);
      setSuccess(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedStatus, getUserInvites]);

  const deleteInvite = useCallback(async (inviteId) => {
    setLoading(true);
    try {
      const result = await TeamInviteService.deleteInvite(inviteId);
      setSuccess('Zaproszenie zostało usunięte');
      setError(null);
      // Odśwież listę zaproszeń po usunięciu
      getUserInvites(currentPage, 5, selectedStatus);
      return result;
    } catch (err) {
      setError(err.message);
      setSuccess(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedStatus, getUserInvites]);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const value = {
    userRoles,
    error,
    success,
    totalPages,
    currentPage,
    totalInvites,
    invites,
    loading,
    selectedStatus,
    fetchUserRoles,
    createInvite,
    getUserInvites,
    getTeamInvites,
    getInviteById,
    acceptInvite,
    declineInvite,
    deleteInvite,
    clearMessages,
    setSelectedStatus
  };

  return (
    <TeamInviteContext.Provider value={value}>
      {children}
    </TeamInviteContext.Provider>
  );
}; 