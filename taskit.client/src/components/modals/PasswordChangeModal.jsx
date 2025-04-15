import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "./Modal.css";
import { FaTimes } from "react-icons/fa";

export const PasswordChangeModal = ({ onClose }) => {
  const { changeUserPassword } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!formData.oldPassword) newErrors.oldPassword = "Stare hasło jest wymagane.";
    if (!formData.newPassword) newErrors.newPassword = "Nowe hasło jest wymagane.";
    else if (formData.newPassword.length < 6) newErrors.newPassword = "Nowe hasło musi mieć minimum 6 znaków.";
    
    if (!formData.confirmPassword) newErrors.confirmPassword = "Potwierdź nowe hasło.";
    else if (formData.newPassword !== formData.confirmPassword) 
      newErrors.confirmPassword = "Hasła muszą być identyczne.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");
    
    if (!validate()) return;

    try {
      await changeUserPassword(formData.oldPassword, formData.newPassword);
      setSuccessMessage("Hasło zostało zmienione pomyślnie!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
        <h2>Zmiana hasła</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Stare hasło"
            value={formData.oldPassword}
            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
          />
          {errors.oldPassword && <p className="error-message">{errors.oldPassword}</p>}

          <input
            type="password"
            placeholder="Nowe hasło"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />
          {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}

          <input
            type="password"
            placeholder="Potwierdź nowe hasło"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          <div className="form-buttons">
          <button className="btn-green" type="submit">Zmień hasło</button>
          </div>
        </form>

        {localError && <p className="error-message">{localError}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default PasswordChangeModal; 