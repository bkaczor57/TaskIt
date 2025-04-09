import React, { useState, useEffect } from 'react';
import { useUserTeam } from '../../context/UserTeamContext';
import { useUser } from '../../context/UserContext';
import { useTeam } from '../../context/TeamContext';
import './ModalCommon.css';

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
    try {
      await removeUserFromTeam(teamId, userId);
      if (onUserUpdated) onUserUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
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
          <button className="close-btn" onClick={onClose}>✕</button>
          <p className="error-message">{error}</p>
          <button className="btn-green" onClick={onClose}>Zamknij</button>
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
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>Informacje o użytkowniku</h2>

        <div className="user-info">
          <p>
            <strong>Email:</strong>
            <span>{userInfo.email}</span>
          </p>
          <p>
            <strong>Nazwa użytkownika:</strong>
            <span>{userInfo.username}</span>
          </p>
          <p>
            <strong>Imię:</strong>
            <span>{userInfo.firstName}</span>
          </p>
          <p>
            <strong>Nazwisko:</strong>
            <span>{userInfo.lastName}</span>
          </p>
          <p>
            <strong>Rola w grupie:</strong>
            <span className={`user-role-badge ${isUserOwner ? 'owner' : userInfo.role.toLowerCase()}`}>
              {isUserOwner ? 'Owner' : userInfo.role}
            </span>
          </p>
        </div>

        {canModifyUser && (
          <div className="user-actions">
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
                className="btn-green"
                onClick={handleRoleChange}
                disabled={selectedRole === userInfo.role}
              >
                Zmień rolę
              </button>
            </div>

            <button
              className="btn-danger"
              onClick={handleRemoveUser}
            >
              Usuń użytkownika
            </button>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default UserInfoModal;
