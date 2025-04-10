import React, { useState, useEffect, useContext } from 'react';
import './GroupSidebar.css';
import UserContext from '../../context/UserContext';
import UserTeamContext from '../../context/UserTeamContext';
import TeamContext from '../../context/TeamContext';
import { FaUsers, FaSignOutAlt, FaTrash, FaTimes, FaPencilAlt, FaInfoCircle, FaUserPlus } from 'react-icons/fa';
import { GrUserManager, GrUserPolice, GrUserWorker, GrUserAdmin } from 'react-icons/gr';
import { MdInfoOutline } from "react-icons/md";
import GroupInviteModal from '../modals/GroupInviteModal';
import UserInfoModal from '../modals/UserInfoModal';

const GroupSidebar = ({ group, isMobile, isVisible, onClose, onLeaveGroup, onDeleteGroup, onGroupUpdated }) => {
  const [showUsers, setShowUsers] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedName, setEditedName] = useState(group.name);
  const [editedDescription, setEditedDescription] = useState(group.description || '');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { setCurrentTeam, updateTeam } = useContext(TeamContext);
  const { teamUsers, fetchTeamUsers, updateUserRole } = useContext(UserTeamContext);
  const { user } = useContext(UserContext);

  const isOwner = user?.id === group.ownerId;
  const userRole = teamUsers.find(u => u.id === user?.id)?.role;
  const canInviteUsers = isOwner || userRole === 'Admin' || userRole === 'Manager';

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

  useEffect(() => {
    const handleUserUpdated = () => {
      if (group?.id) {
        fetchTeamUsers(group.id);
      }
    };

    window.addEventListener("userUpdated", handleUserUpdated);
    return () => window.removeEventListener("userUpdated", handleUserUpdated);
  }, [group?.id, fetchTeamUsers]);

  const handleSave = async (field) => {
    try {
      const updatedFields = field === 'name' ? { ...group, name: editedName } : { ...group, description: editedDescription };
      await updateTeam(group.id, updatedFields);
      setIsEditingName(false);
      setIsEditingDescription(false);
      onGroupUpdated();
    } catch (error) {
      console.error('Błąd podczas aktualizacji grupy:', error);
    }
  };

  const handleShowUserInfo = (user) => {
    setCurrentTeam(group);
    setSelectedUser(user);
  };

  const getRoleIcon = (role) => {
    if (!role) return <GrUserWorker />;

    switch (role.toLowerCase()) {
      case 'manager':
        return <GrUserManager />;
      case 'admin':
        return <GrUserPolice />;
      case 'member':
        return <GrUserWorker />;
      case 'owner':
        return <GrUserAdmin />;
      default:
        return <GrUserWorker />;
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
            ) : (
              <div className="group-title-container">
                <h3 className="group-title" title={group.name}>{group.name}</h3>
                {isOwner && (
                  <button className="edit-button" onClick={() => setIsEditingName(true)}>
                    <FaPencilAlt />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="group-description-header">
            <span>Opis grupy</span>
            {isOwner && !isEditingDescription && <button className="edit-button" onClick={() => setIsEditingDescription(true)}><FaPencilAlt /></button>}
          </div>
          <div className="group-description-box">


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
          <div className="users-header">
            <button className="users-toggle" onClick={() => setShowUsers(!showUsers)}>
              <FaUsers /> Użytkownicy ({teamUsers.length})
            </button>
            {canInviteUsers && (
              <button className="invite-user-button" onClick={() => setShowInviteModal(true)} title="Zaproś użytkownika">
                <FaUserPlus />
              </button>
            )}
          </div>

          <div className={`users-list ${showUsers ? 'expand' : 'collapse'}`}>
            {teamUsers.map(u => (
              <div key={u.id} className="user-item">
                <div className={`user-role ${u.id === group.ownerId ? 'owner' : u.role.toLowerCase()}`}>
                  {u.id === group.ownerId ? <GrUserAdmin /> : getRoleIcon(u.role)}
                </div>
                <div className="user-name" title={`${u.firstName} ${u.lastName}`}>
                  {u.firstName} {u.lastName}
                </div>
                <button className="info-button" onClick={() => handleShowUserInfo(u)}>
                  <MdInfoOutline />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="group-actions">
          {isOwner ? (
            <button className="delete-group" onClick={onDeleteGroup}><FaTrash /> Usuń grupę</button>
          ) : (
            <button className="leave-group" onClick={onLeaveGroup}><FaSignOutAlt /> Opuść grupę</button>
          )}
        </div>
      </aside>

      {showInviteModal && <GroupInviteModal onClose={() => setShowInviteModal(false)} teamId={group.id} />}
      {selectedUser && <UserInfoModal onClose={() => setSelectedUser(null)} teamId={group.id} userId={selectedUser.id} onUserUpdated={() => fetchTeamUsers(group.id)} />}
    </>
  );
};

export default GroupSidebar;

