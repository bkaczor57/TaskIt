import React, { useState, useContext } from 'react';
import TeamContext from '../../context/TeamContext';
import './Modal.css';
import './ModalCommon.css'
import {FaTimes} from 'react-icons/fa';

const CreateTeamModal = ({ onClose, fetchUserTeams, navigate }) => {
  const {
    createTeam,
    createTeamResult,
    apiError,
    clearApiError
  } = useContext(TeamContext);

  const [errors, setErrors] = useState({});
  const [localError, setLocalError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleClose = async () => {
    clearApiError();
    onClose();

    if (createTeamResult) { 
      await fetchUserTeams();   
      navigate(`/teams/${createTeamResult.id}`); 
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nazwa jest wymagana.';
    else if (formData.name.length >= 50) newErrors.name = 'Nazwa może mieć maksymalnie 50 znaków.';
    if (formData.description.length >= 500)
      newErrors.description = 'Opis może mieć maksymalnie 500 znaków.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!validate()) return;

    try {
      await createTeam(formData.name, formData.description);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  if (createTeamResult) {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={handleClose}><FaTimes/></button>
          <h2>Grupa została utworzona</h2>
          <p>Grupa <strong>{createTeamResult.name}</strong> została dodana poprawnie.</p>

          <button className="btn-green" onClick={handleClose}>Przejdź do grupy</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={handleClose}><FaTimes/></button>
        <h2>Utwórz nowy zespół</h2>
        <form onSubmit={handleCreateTeam}>
          <input
            type="text"
            placeholder="Nazwa zespołu"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}

          <textarea
            placeholder="Opis (opcjonalnie)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          {errors.description && <p className="error-message">{errors.description}</p>}

          <div className="form-buttons">
            <button className="btn-green" type="submit">Utwórz</button>
          </div>
        </form>
        {(apiError || localError) && (
          <p className="error-message">{localError || apiError}</p>
        )}
      </div>
    </div>
  );
};
export default CreateTeamModal;
