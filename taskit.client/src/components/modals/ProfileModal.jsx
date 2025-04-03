import React, { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import AuthContext from "../../context/AuthContext";
import { updateCurrentUser } from "../../services/UserService";
import { PasswordChangeModal } from "./PasswordChangeModal";
import "./Modal.css";

export const ProfileModal = ({ onClose }) => {
  const { logout } = useContext(AuthContext);
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const [errors, setErrors] = useState({});
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "Imię jest wymagane.";
    else if (formData.firstName.length < 2 || formData.firstName.length > 30)
      newErrors.firstName = "Imię musi mieć od 2 do 30 znaków.";

    if (!formData.lastName) newErrors.lastName = "Nazwisko jest wymagane.";
    else if (formData.lastName.length < 2 || formData.lastName.length > 30)
      newErrors.lastName = "Nazwisko musi mieć od 2 do 30 znaków.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");

    if (!validate()) return;

    try {
      const updatedUser = await updateCurrentUser(formData);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccessMessage("Profil został zaktualizowany pomyślnie!");
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>Profil użytkownika</h2>
        <div className="user-info">
          <p>
            <strong>Email:</strong>
            <span className="tooltip">
              <span className="tooltip-text">{user?.email}</span>
              <span className="tooltip-bubble">{user?.email}</span>
            </span>
          </p>
          <p>
            <strong>Nazwa użytkownika:</strong>
            <span className="tooltip">
              <span className="tooltip-text">{user?.username}</span>
              <span className="tooltip-bubble">{user?.username}</span>
            </span>
          </p>
        </div>

        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Imię"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}

          <input
            type="text"
            placeholder="Nazwisko"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
          <div className="form-buttons">
            <button type="submit" className="btn-green">Zapisz zmiany</button>
            <button
              type="button"
              className="btn-orange"
              onClick={() => setShowPasswordModal(true)}
            >
              Zmień hasło
            </button>
          </div>

        </form>
        <button
          className="btn-danger btn-full-width"
          onClick={logout}
        >
          Wyloguj się
        </button>

        {localError && <p className="error-message">{localError}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {showPasswordModal && (
          <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
