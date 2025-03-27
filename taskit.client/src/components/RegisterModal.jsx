import React, { useState } from "react";
import axios from "axios";
import "./Modal.css";
import { RegisterSuccessModal } from "./RegisterSuccessModal";

export const RegisterModal = ({ onClose, onOpenLogin }) => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [registeredUsername, setRegisteredUsername] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email jest wymagany.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Niepoprawny format email.";

    if (!formData.username) newErrors.username = "Nazwa użytkownika jest wymagana.";

    if (!formData.password) newErrors.password = "Hasło jest wymagane.";
    else if (formData.password.length < 8) newErrors.password = "Hasło musi mieć co najmniej 8 znaków.";

    if (!formData.firstName) newErrors.firstName = "Imię jest wymagane.";
    else if (formData.firstName.length < 2 || formData.firstName.length > 30)
      newErrors.firstName = "Imię musi mieć od 2 do 30 znaków.";

    if (!formData.lastName) newErrors.lastName = "Nazwisko jest wymagane.";
    else if (formData.lastName.length < 2 || formData.lastName.length > 30)
      newErrors.lastName = "Nazwisko musi mieć od 2 do 30 znaków.";

    if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Potwierdzenie hasła jest wymagane.";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Hasła nie są zgodne.";
      }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("/api/Auth/register", formData);
      setRegisteredUsername(res.data.username); // zakładamy, że backend zwraca username
    } catch (err) {
      if (err.response?.data?.error) {
        setServerError(err.response.data.error);
      } else {
        setServerError("Wystąpił nieoczekiwany błąd.");
      }
    }
  };

  if (registeredUsername) {
    return (
      <RegisterSuccessModal username={registeredUsername} onClose={onClose} onOpenLogin={onOpenLogin} />
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
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
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="error-message">Hasła nie są zgodne.</p>)}

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

          <button type="submit">Zarejestruj się</button>
        </form>
        {serverError && <p className="error-message">{serverError}</p>}
      </div>
    </div>
  );
};

export default RegisterModal;
