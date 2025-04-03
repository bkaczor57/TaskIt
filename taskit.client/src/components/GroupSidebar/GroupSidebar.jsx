import React, { useState, useEffect, useContext } from 'react';
import './GroupSidebar.css';
import TeamContext from '../../context/TeamContext';
import UserContext from '../../context/UserContext';
import { FaUsers, FaSignOutAlt, FaTrash, FaTimes } from 'react-icons/fa';

const GroupSidebar = ({ group, isMobile, isVisible, onClose, onLeaveGroup, onDeleteGroup }) => {
  const [showUsers, setShowUsers] = useState(false);
  const { teamUsers, fetchTeamUsers } = useContext(TeamContext);
  const { user } = useContext(UserContext);

  const isOwner = user?.id === group.ownerId;

  useEffect(() => {
    if (group?.id) {
      fetchTeamUsers(group.id);
    }
  }, [group.id, fetchTeamUsers]);

  const toggleUsers = () => {
    setShowUsers(!showUsers);
  };

  return (
    <>
      {isMobile && isVisible && (
        <div 
          className="group-sidebar-overlay visible"
          onClick={onClose}
        />
      )}
      
      <aside className={`group-sidebar ${isMobile ? 'mobile' : 'desktop'} ${isVisible ? 'visible' : 'hidden'}`}>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="group-info">
          <h3>{group.title}</h3>
          <p className="group-description">{group.description || "Brak opisu grupy."}</p>
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
                  className={`user-item ${user.id === group.ownerId ? 'owner' : ''}`}
                >
                  <span>
                    {user.firstName} {user.lastName}
                    {user.id === group.ownerId && ' (właściciel)'}
                  </span>
                  {isOwner && user.id !== group.ownerId && (
                    <button className="remove-user">Usuń</button>
                  )}
                </div>
              ))}
              {isOwner && <button className="add-user">Dodaj użytkownika</button>}
            </div>
          )}
        </div>

        <div className="group-actions">
          {isOwner ? (
            <button className="delete-group" onClick={onDeleteGroup}>
              <FaTrash /> Usuń grupę
            </button>
          ) : (
            <button className="leave-group" onClick={onLeaveGroup}>
              <FaSignOutAlt /> Opuść grupę
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default GroupSidebar;