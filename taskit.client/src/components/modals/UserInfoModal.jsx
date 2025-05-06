import React, { useState, useEffect } from 'react';
import { useUserTeam } from '../../context/UserTeamContext';
import { useUser } from '../../context/UserContext';
import { useTeam } from '../../context/TeamContext';
import './Modal.css';
import './UserInfoModal.css';
import { FaTimes, FaUserAlt, FaEnvelope, FaIdCard, FaUserTag, FaUserCog, FaTrashAlt } from 'react-icons/fa';
import { GrUserManager, GrUserPolice, GrUserWorker, GrUserAdmin } from 'react-icons/gr';

export const UserInfoModal = ({ onClose, teamId, userId, onUserUpdated }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const { getUserInTeam, updateUserRole, removeUserFromTeam, teamUsers } = useUserTeam();
  const { user } = useUser();
  const { currentTeam } = useTeam();

  // czy wybrany użytkownik to właściciel?
  const isUserOwner = userId === currentTeam?.ownerId;

  // czy aktualnie zalogowany użytkownik to właściciel?
  const isCurrentUserOwner = user?.id === currentTeam?.ownerId;

  // czy aktualnie zalogowany użytkownik to Admin w zespole
  const currentUserInTeam = teamUsers.find(u => u.id === user?.id);
  const isAdmin = currentUserInTeam?.role === 'Admin';

  // może zmieniać lub usuwać?
  const canModifyUser = currentTeam && (isAdmin || isCurrentUserOwner) && !isUserOwner;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInTeam(teamId, userId);
        setUserInfo(data);
        setSelectedRole(data.role);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [teamId, userId, getUserInTeam]);

  const handleRoleChange = async () => {
    try {
      await updateUserRole(teamId, userId, selectedRole);
      setUserInfo({ ...userInfo, role: selectedRole });
      setError(null);
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveUser = async () => {
    if (window.confirm(`Czy na pewno chcesz usunąć użytkownika ${userInfo.firstName} ${userInfo.lastName} z zespołu?`)) {
      try {
        await removeUserFromTeam(teamId, userId);
        if (onUserUpdated) onUserUpdated();
        onClose();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getRoleIcon = (role) => {
    if (isUserOwner) return <GrUserAdmin />;
    
    switch (role?.toLowerCase()) {
      case 'manager':
        return <GrUserManager />;
      case 'admin':
        return <GrUserPolice />;
      case 'member':
        return <GrUserWorker />;
      default:
        return <GrUserWorker />;
    }
  };

  if (loading || !userInfo || !currentTeam) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal user-info-modal" onClick={(e) => e.stopPropagation()}>
          <p className="loading-message">Ładowanie danych użytkownika...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal user-info-modal" onClick={(e) => e.stopPropagation()}>
          <div className="user-info-modal-header">
            <span className="user-info-modal-title">Błąd</span>
            <button className="close-modal-button" onClick={onClose}><FaTimes /></button>
          </div>
          <p className="error-message">{error}</p>
          <button className="btn btn-green" onClick={onClose}>Zamknij</button>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal user-info-modal" onClick={(e) => e.stopPropagation()}>
        <div className="user-info-modal-header">
          <span className="user-info-modal-title">Informacje o użytkowniku</span>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="user-info">
          <p>
            <strong><FaEnvelope /> Email:</strong>
            <span title={userInfo.email}>{userInfo.email}</span>
          </p>
          <p>
            <strong><FaUserAlt /> Nazwa użytkownika:</strong>
            <span title={userInfo.username}>{userInfo.username}</span>
          </p>
          <p>
            <strong><FaIdCard /> Imię:</strong>
            <span title={userInfo.firstName}>{userInfo.firstName}</span>
          </p>
          <p>
            <strong><FaIdCard /> Nazwisko:</strong>
            <span title={userInfo.lastName}>{userInfo.lastName}</span>
          </p>
          <p>
            <strong><FaUserTag /> Rola w grupie:</strong>
            <span className={`user-role-badge ${isUserOwner ? 'owner' : userInfo.role.toLowerCase()}`}>
              <span className="user-role-icon">{getRoleIcon(isUserOwner ? 'Owner' : userInfo.role)}</span>
              {isUserOwner ? 'Owner' : userInfo.role}
            </span>
          </p>
        </div>

        {canModifyUser && (
          <div className="user-actions">
            <h4><FaUserCog /> Zarządzanie użytkownikiem</h4>
            <div className="role-change">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="Member">Member</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
              <button
                className="btn btn-green"
                onClick={handleRoleChange}
                disabled={selectedRole === userInfo.role}
              >
                Zmień rolę
              </button>
            </div>

            <button
              className="btn btn-danger btn-full-width"
              onClick={handleRemoveUser}
            >
              <FaTrashAlt /> Usuń użytkownika
            </button>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default UserInfoModal;
