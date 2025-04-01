import React, { useState, useContext } from "react";
import "./Modal.css";
import { RegisterSuccessModal } from "./RegisterSuccessModal";
import AuthContext from "../../context/AuthContext";

export const RegisterModal = ({ onClose, onOpenLogin }) => {
  const { register, authError, registerResult,clearAuthError } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  
  const [errors, setErrors] = useState({});
  const [localError, setLocalError] = useState("");

  const handleClose = () => {
    setErrors({});
    setLocalError("");
    clearAuthError(); // wyczyść globalny błąd
    onClose();        // zamyka modal z zewnątrz
  };


  const validate = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email jest wymagany.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Niepoprawny format email.";

    if (!formData.username) newErrors.username = "Nazwa użytkownika jest wymagana.";

    if (!formData.password) newErrors.password = "Hasło jest wymagane.";
    else if (formData.password.length < 8) newErrors.password = "Hasło musi mieć co najmniej 8 znaków.";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Potwierdzenie hasła jest wymagane.";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Hasła nie są zgodne.";

    if (!formData.firstName) newErrors.firstName = "Imię jest wymagane.";
    else if (formData.firstName.length < 2 || formData.firstName.length > 30)
      newErrors.firstName = "Imię musi mieć od 2 do 30 znaków.";

    if (!formData.lastName) newErrors.lastName = "Nazwisko jest wymagane.";
    else if (formData.lastName.length < 2 || formData.lastName.length > 30)
      newErrors.lastName = "Nazwisko musi mieć od 2 do 30 znaków.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!validate()) return;

    try {
      await register(formData);
    } catch (err) {
      setLocalError(err.message); // Błąd obsługiwany globalnie i lokalnie
    }
  };

  if (registerResult) {
    return (
      <RegisterSuccessModal
        username={registerResult}
        onClose={onClose}
        onOpenLogin={onOpenLogin}
      />
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>✕</button>
        <h2>Rejestracja</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

          <input
            type="text"
            placeholder="Nazwa użytkownika"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          {errors.username && <p className="error-message">{errors.username}</p>}

          <input
            type="password"
            placeholder="Hasło"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}

          <input
            type="password"
            placeholder="Potwierdź hasło"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

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
          <button class="btn-green" type="submit">Zarejestruj się</button>
          </div>
        </form>
        {(authError || localError) && (
          <p className="error-message">{localError || authError}</p>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
