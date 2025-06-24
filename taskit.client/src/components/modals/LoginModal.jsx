import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./Modal.css";
import { FaTimes } from "react-icons/fa";

export const LoginModal = ({ onClose }) => {
  const { login, authError, clearAuthError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch {
      // Błąd już powinien być zapisany w `authError` przez AuthContext/AuthService
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      password: "",
    });
    clearAuthError?.();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}><FaTimes /></button>
        <h2>Logowanie</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Hasło"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <div className="form-buttons">
            <button className="btn-green" type="submit">Zaloguj się</button>
          </div>
        </form>

        {authError && <p className="error-message">{authError}</p>}
      </div>
    </div>
  );
};

export default LoginModal;
