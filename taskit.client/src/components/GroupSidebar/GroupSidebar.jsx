import React, { useState, useEffect, useContext } from 'react';
import './GroupSidebar.css';
import UserContext from '../../context/UserContext';
import UserTeamContext from '../../context/UserTeamContext';
import TeamContext from '../../context/TeamContext';
import { FaUsers, FaSignOutAlt, FaTrash, FaTimes, FaPencilAlt, FaInfoCircle } from 'react-icons/fa';

const GroupSidebar = ({ group, isMobile, isVisible, onClose, onLeaveGroup, onDeleteGroup, onGroupUpdated }) => {
  const [showUsers, setShowUsers] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedName, setEditedName] = useState(group.name);
  const [editedDescription, setEditedDescription] = useState(group.description || '');

  const { teamUsers, fetchTeamUsers, updateUserRole } = useContext(UserTeamContext);
  const { user } = useContext(UserContext);
  const { updateTeam } = useContext(TeamContext);

  const isOwner = user?.id === group.ownerId;
  const isAdmin = teamUsers.find(u => u.id === user?.id)?.role === 'Admin';

  useEffect(() => {
    if (group) {
      setEditedName(group.name || '');
      setEditedDescription(group.description || '');
    }
  }, [group]);

  useEffect(() => {
    if (group?.id) {
      fetchTeamUsers(group.id);
    }
  }, [group.id, fetchTeamUsers]);

  const toggleUsers = () => setShowUsers(!showUsers);

  const handleSave = async (field) => {
    try {
      const updatedFields = field === 'name'
        ? { ...group, name: editedName }
        : { ...group, description: editedDescription };
      await updateTeam(group.id, updatedFields);
      setIsEditingName(false);
      setIsEditingDescription(false);
      onGroupUpdated(); // Fetch fresh data from backend
    } catch (error) {
      console.error('Błąd podczas aktualizacji grupy:', error);
    }
  };

  const renderRoleSelect = (teamUser) => (
    (isAdmin || isOwner) && teamUser.id !== group.ownerId && (
      <select
        className="role-select"
        value={teamUser.role}
        onChange={(e) => handleRoleChange(teamUser.id, e.target.value)}
      >
        <option value="Member">Member</option>
        <option value="Manager">Manager</option>
        <option value="Admin">Admin</option>
      </select>
    )
  );

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(group.id, userId, newRole);
      await fetchTeamUsers(group.id);
    } catch (error) {
      console.error('Błąd podczas aktualizacji roli użytkownika:', error);
    }
  };

  return (
    <>
      {isMobile && isVisible && <div className="group-sidebar-overlay visible" onClick={onClose} />}

      <aside className={`group-sidebar ${isMobile ? 'mobile' : 'desktop'} ${isVisible ? 'visible' : 'hidden'}`}>
        <button className="close-button" onClick={onClose}><FaTimes /></button>

        <div className="group-info">
          <div className="group-info-header">
            {isEditingName ? (
              <>
                <div className="edit-section">
                  <input
                    type="text"
                    className="group-title-edit"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  <div className="edit-buttons">
                    <button className="cancel-button" onClick={() => setIsEditingName(false)}>Anuluj</button>
                    <button className="save-button" onClick={() => handleSave('name')}>Zapisz</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="group-title">{group.name}</h3>
                {isOwner && <button className="edit-button" onClick={() => setIsEditingName(true)}><FaPencilAlt /></button>}
              </>
            )}
          </div>

          <div className="group-description-box">
            <div className="group-description-header">
              <span>Opis grupy</span>
              {isOwner && !isEditingDescription && <button className="edit-button" onClick={() => setIsEditingDescription(true)}><FaPencilAlt /></button>}
            </div>

            {isEditingDescription ? (
              <>
                <textarea
                  className="group-description-edit"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Dodaj opis grupy..."
                />
                <div className="edit-buttons">
                  <button className="cancel-button" onClick={() => setIsEditingDescription(false)}>Anuluj</button>
                  <button className="save-button" onClick={() => handleSave('description')}>Zapisz</button>
                </div>
              </>
            ) : (
              <p className="group-description">{group.description || 'Brak opisu grupy.'}</p>
            )}
          </div>
        </div>

        <div className="users-section">
          <button className="users-toggle" onClick={toggleUsers}>
            <FaUsers /> Użytkownicy ({teamUsers.length})
          </button>
          {showUsers && (
            <div className="users-list">
              {teamUsers.map(user => (
                <div
                  key={user.id}
                  className="user-item"
                >
                  <div className={`user-role ${user.role.toLowerCase()}`}>{user.role[0]}</div>
                  <div className="user-name" title={`${user.firstName} ${user.lastName}`}>
                    {user.firstName} {user.lastName}
                  </div>
                  <button
                    className="info-button"
                    onClick={() => handleShowUserInfo(user)}
                  >
                    <FaInfoCircle />
                  </button>
                </div>
              ))}
              
            </div>
          )}
        </div>

        <div className="group-actions">
          {isOwner ? (
            <button className="delete-group" onClick={onDeleteGroup}><FaTrash /> Usuń grupę</button>
          ) : (
            <button className="leave-group" onClick={onLeaveGroup}><FaSignOutAlt /> Opuść grupę</button>
          )}
        </div>
      </aside>
    </>
  );
};

export default GroupSidebar;