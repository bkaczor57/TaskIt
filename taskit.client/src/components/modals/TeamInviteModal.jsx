import React, { useState, useEffect } from 'react';
import { useTeamInvite } from '../../context/TeamInviteContext';
import './Modal.css';
import { FaTimes } from 'react-icons/fa';

export const TeamInviteModal = ({ onClose, teamId }) => {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [localError, setLocalError] = useState(null);
  const { userRoles, error, success, fetchUserRoles, createInvite, clearMessages } = useTeamInvite();

  useEffect(() => {
    fetchUserRoles();
  }, [fetchUserRoles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await createInvite(teamId, email, selectedRole);
      setEmail('');
      setSelectedRole('');
    } catch (err) {
      console.error(err);
      // jeśli przyjdzie zwykły string, użyj go,
      // jeśli Error – weź .message
      setLocalError(err?.message ?? String(err));
    }
  };

  const handleClose = () => {
    clearMessages();
    setLocalError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
        <h2>Zaproś użytkownika do grupy</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email użytkownika"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="role-change">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              required
            >
              <option value="">Wybierz rolę</option>
              {userRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-green">
              Wyślij zaproszenie
            </button>
          </div>
        </form>

        {(localError || error) && (
          <p
            className="error-message"
            title={localError || error}             /* pełny tekst w tooltipie */
          >
            {/* skracamy nadmiar długich komunikatów w UI — toast i tooltip pokazują całość */}
            {(localError || error).length > 120
              ? (localError || error).slice(0, 117)
              : (localError || error)}
          </p>
        )}

        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default TeamInviteModal;