import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./Modal.css";

export const LoginModal = ({ onClose }) => {
  const { login, authError } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setLocalError(err.message); // logika błędu znajduje się w AuthContext/AuthService
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>Logowanie</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="form-buttons">
          <button class="btn-green" type="submit">Zaloguj się</button>
          </div>
        </form>
        {(authError || localError) && (
          <p className="error-message">{localError || authError}</p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
