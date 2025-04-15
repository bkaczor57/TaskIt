import React from "react";
import "./Modal.css";
import { FaTimes } from "react-icons/fa";

export const RegisterSuccessModal = ({ username, onClose, onOpenLogin }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
        <h2>Rejestracja zakończona</h2>
        <p>Pomyślnie zarejestrowano użytkownika <strong>{username}</strong>.</p>
        <button className="register-success-btn" onClick={() => { onClose(); onOpenLogin(); }}>
          Przejdź do logowania
        </button>
      </div>
    </div>
  );
};
