// UserInviteDetailsModal.jsx
import React, { useState } from 'react';
import { useTeamInvite } from '../../context/TeamInviteContext';
import './ModalCommon.css';
import './UserInvitesModal.css';
import { FaTimes, FaUsers, FaUserTag, FaCalendarAlt, FaUserPlus, FaCheck, FaTimes as FaTimesCircle } from 'react-icons/fa';

const UserInviteDetailsModal = ({ invite, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { acceptInvite, declineInvite, error, success } = useTeamInvite();

  const formatDate = (dateString) => {
    if (!dateString) return "Brak daty";
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptInvite(invite.id);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error("Błąd akceptowania zaproszenia:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      await declineInvite(invite.id);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error("Błąd odrzucania zaproszenia:", err);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = invite.status !== 'Pending';

  const getRoleClass = (role) => {
    if (!role) return 'member';
    const roleLower = role.toLowerCase();
    if (roleLower.includes('admin')) return 'admin';
    if (roleLower.includes('manager')) return 'manager';
    if (roleLower.includes('owner')) return 'owner';
    return 'member';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal invite-details" onClick={(e) => e.stopPropagation()}>
        <div className="invites-modal-header">
          <h2 className="invites-modal-title">Szczegóły zaproszenia</h2>
          <button className="close-modal-button" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="invite-details-content">
          <div className="invite-detail-group">
            <div className="invite-detail-item">
              <span className="invite-detail-icon"><FaUsers /></span>
              <span className="invite-detail-label">Zespół:</span>
              <span className="invite-detail-value">{invite.team?.name || "Nieznany zespół"}</span>
            </div>

            <div className="invite-detail-item">
              <span className="invite-detail-icon"><FaUserPlus /></span>
              <span className="invite-detail-label">Zapraszający:</span>
              <span className="invite-detail-value">{invite.invitingUser?.firstName} {invite.invitingUser?.lastName}</span>
            </div>

            <div className="invite-detail-item">
              <span className="invite-detail-icon"><FaUserTag /></span>
              <span className="invite-detail-label">Rola w zespole:</span>
              <span className={`invite-detail-value user-role-badge ${getRoleClass(invite.teamRole)}`}>{invite.teamRole || "Członek"}</span>
            </div>

            <div className="invite-detail-item">
              <span className="invite-detail-icon"><FaCalendarAlt /></span>
              <span className="invite-detail-label">Data zaproszenia:</span>
              <span className="invite-detail-value">{formatDate(invite.inviteDate)}</span>
            </div>

            {invite.responseDate && (
              <div className="invite-detail-item">
                <span className="invite-detail-icon"><FaCalendarAlt /></span>
                <span className="invite-detail-label">Data odpowiedzi:</span>
                <span className="invite-detail-value">{formatDate(invite.responseDate)}</span>
              </div>
            )}

            <div className="invite-detail-item">
              <span className="invite-detail-icon">
                {invite.status === 'Pending' && <FaUserPlus className="status-pending" />}
                {invite.status === 'Accepted' && <FaCheck className="status-accepted" />}
                {invite.status === 'Declined' && <FaTimesCircle className="status-declined" />}
              </span>
              <span className="invite-detail-label">Status:</span>
              <span className={`invite-detail-value status-${invite.status?.toLowerCase()}`}>
                {invite.status === 'Pending' ? 'Oczekujące' : invite.status === 'Accepted' ? 'Zaakceptowane' : invite.status === 'Declined' ? 'Odrzucone' : invite.status}
              </span>
            </div>
          </div>

          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          {invite.status === 'Pending' && (
            <div className="invite-actions">
              <button className="btn btn-green" onClick={handleAccept} disabled={loading || isDisabled}><FaCheck /> Akceptuj</button>
              <button className="btn btn-danger" onClick={handleDecline} disabled={loading || isDisabled}><FaTimesCircle /> Odrzuć</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInviteDetailsModal;
