import React, { useState, useEffect } from 'react';
import { useTeamInvite } from '../../context/TeamInviteContext';
import UserInviteDetailsModal from './UserInviteDetailsModal';
import './UserInviteModal.css'; // Używamy nowego pliku CSS
import { FaTimes, FaUsers, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const UserInviteListModal = ({ onClose }) => {
  const { invites, loading, error, success, clearMessages, totalPages, currentPage, selectedStatus, getUserInvites, setSelectedStatus } = useTeamInvite();
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    getUserInvites(1, 5, selectedStatus);
  }, [getUserInvites, selectedStatus]);

  const handlePageChange = (page) => getUserInvites(page, 5, selectedStatus);
  const handleInviteClick = (invite) => {
    setSelectedInvite(invite);
    setShowDetailsModal(true);
  };
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedInvite(null);
  };

  const handleClose =  () => {
    clearMessages();
    onClose();
  }

  const truncateText = (text, maxLength = 20) => text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal invite-list-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}><FaTimes /></button>
        <div className="invites-modal-header">
          <h2 className="invites-modal-title">Zaproszenia do zespołów</h2>
        </div>

        <div className="invite-filter">
          <div className="filter-label"><FaFilter /> Filtruj:</div>
          <div className="filter-buttons">
            {['All', 'Pending', 'Accepted', 'Declined'].map(status => (
              <button 
                key={status}
                className={`filter-btn ${selectedStatus === status ? 'active' : ''}`}
                onClick={() => setSelectedStatus(status)}
              >
                {status === 'All' ? 'Wszystkie' : status === 'Pending' ? 'Oczekujące' : status === 'Accepted' ? 'Zaakceptowane' : 'Odrzucone'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-message">Ładowanie zaproszeń...</div>
        ) : invites.length === 0 ? (
          <div className="no-invites-message">Brak zaproszeń</div>
        ) : (
          <div className="invite-list">
            {invites.map(invite => (
              <div key={invite.id} className="invite-item" onClick={() => handleInviteClick(invite)}>
                <div className="invite-item-icon"><FaUsers /></div>
                <div className="invite-item-content">
                  <div className="invite-item-team" title={invite.team?.name || 'Nieznany zespół'}>
                    {truncateText(invite.team?.name || 'Nieznany zespół')}
                  </div>
                  <div className={`invite-item-status status-${invite.status?.toLowerCase()}`}>
                    {invite.status === 'Pending' ? 'Oczekujące' : invite.status === 'Accepted' ? 'Zaakceptowane' : invite.status === 'Declined' ? 'Odrzucone' : invite.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              disabled={currentPage === 1} 
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FaChevronLeft />
            </button>
            <span className="pagination-info">Strona {currentPage} z {totalPages}</span>
            <button 
              className="pagination-btn" 
              disabled={currentPage === totalPages} 
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {showDetailsModal && selectedInvite && (
          <UserInviteDetailsModal invite={selectedInvite} onClose={handleCloseDetails} />
        )}
      </div>
    </div>
  );
};

export default UserInviteListModal;
