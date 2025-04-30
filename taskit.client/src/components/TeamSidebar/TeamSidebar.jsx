import React, { useState, useEffect, useContext } from 'react';
import './TeamSidebar.css';
import UserContext from '../../context/UserContext';
import UserTeamContext from '../../context/UserTeamContext';
import TeamContext from '../../context/TeamContext';
import { FaUsers, FaSignOutAlt, FaTrash, FaTimes, FaPencilAlt, FaInfoCircle, FaUserPlus } from 'react-icons/fa';
import { GrUserManager, GrUserPolice, GrUserWorker, GrUserAdmin } from 'react-icons/gr';
import { MdInfoOutline } from "react-icons/md";
import TeamInviteModal from '../modals/TeamInviteModal';
import UserInfoModal from '../modals/UserInfoModal';

const TeamSidebar = ({ team, isMobile, isVisible, onClose, onLeaveTeam, onDeleteTeam, onTeamUpdated }) => {
  const [showUsers, setShowUsers] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedName, setEditedName] = useState(team.name);
  const [editedDescription, setEditedDescription] = useState(team.description || '');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { setCurrentTeam, updateTeam } = useContext(TeamContext);
  const { teamUsers, fetchTeamUsers, updateUserRole } = useContext(UserTeamContext);
  const { user } = useContext(UserContext);

  const isOwner = user?.id === team.ownerId;
  const userRole = teamUsers.find(u => u.id === user?.id)?.role;
  const canInviteUsers = isOwner || userRole === 'Admin' || userRole === 'Manager';

  useEffect(() => {
    if (team) {
      setEditedName(team.name || '');
      setEditedDescription(team.description || '');
    }
  }, [team]);

  useEffect(() => {
    if (team?.id) {
      fetchTeamUsers(team.id);
    }
  }, [team.id, fetchTeamUsers]);

  useEffect(() => {
    const handleUserUpdated = () => {
      if (team?.id) {
        fetchTeamUsers(team.id);
      }
    };

    window.addEventListener("userUpdated", handleUserUpdated);
    return () => window.removeEventListener("userUpdated", handleUserUpdated);
  }, [team?.id, fetchTeamUsers]);

  const handleSave = async (field) => {
    try {
      const updatedFields = field === 'name' ? { ...team, name: editedName } : { ...team, description: editedDescription };
      await updateTeam(team.id, updatedFields);
      setIsEditingName(false);
      setIsEditingDescription(false);
      onTeamUpdated();
    } catch (error) {
      console.error('Błąd podczas aktualizacji grupy:', error);
    }
  };

  const handleShowUserInfo = (user) => {
    setCurrentTeam(team);
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
      {isMobile && isVisible && <div className="team-sidebar-overlay visible" onClick={onClose} />}

      <aside className={`team-sidebar ${isMobile ? 'mobile' : 'desktop'} ${isVisible ? 'visible' : 'hidden'}`}>
        <button className="close-button" onClick={onClose}><FaTimes /></button>

        <div className="team-info">
          <div className="team-info-header">
            {isEditingName ? (
              <div className="edit-section">
                <input
                  type="text"
                  className="team-title-edit"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <div className="edit-buttons">
                  <button className="cancel-button" onClick={() => setIsEditingName(false)}>Anuluj</button>
                  <button className="save-button" onClick={() => handleSave('name')}>Zapisz</button>
                </div>
              </div>
            ) : (
              <div className="team-title-container">
                <h3 className="team-title" title={team.name}>{team.name}</h3>
                {isOwner && (
                  <button className="edit-button" onClick={() => setIsEditingName(true)}>
                    <FaPencilAlt />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="team-description-header">
            <span>Opis grupy</span>
            {isOwner && !isEditingDescription && <button className="edit-button" onClick={() => setIsEditingDescription(true)}><FaPencilAlt /></button>}
          </div>
          <div className="team-description-box">


            {isEditingDescription ? (
              <>
                <textarea
                  className="team-description-edit"
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
              <p className="team-description">{team.description || 'Brak opisu grupy.'}</p>
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
                <div className={`user-role ${u.id === team.ownerId ? 'owner' : u.role.toLowerCase()}`}>
                  {u.id === team.ownerId ? <GrUserAdmin /> : getRoleIcon(u.role)}
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

        <div className="team-actions">
          {isOwner ? (
            <button className="delete-team" onClick={onDeleteTeam}><FaTrash /> Usuń grupę</button>
          ) : (
            <button className="leave-team" onClick={onLeaveTeam}><FaSignOutAlt /> Opuść grupę</button>
          )}
        </div>
      </aside>

      {showInviteModal && <TeamInviteModal onClose={() => setShowInviteModal(false)} teamId={team.id} />}
      {selectedUser && <UserInfoModal onClose={() => setSelectedUser(null)} teamId={team.id} userId={selectedUser.id} onUserUpdated={() => fetchTeamUsers(team.id)} />}
    </>
  );
};

export default TeamSidebar;

