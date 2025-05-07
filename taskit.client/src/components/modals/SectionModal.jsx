import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './Modal.css';

const SectionModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim());
      setTitle('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>Nowa sekcja</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nazwa sekcji"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="form-buttons">
          <button type="submit" className="btn-green">Utwórz</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Anuluj</button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionModal;
