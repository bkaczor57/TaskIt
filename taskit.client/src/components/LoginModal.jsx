import React from 'react'
import axios from "axios";
import { useState, useContext } from "react";
import AuthContext from '../context/AuthContext';
import {useNavigate} from "react-router-dom"
import "./Modal.css";

export const LoginModal = ({ onClose }) => {
    const {login} = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/Auth/login", {
                email,
                password
            });
            login(res.data);
            navigate("/dashboard");
        } catch (error) {
            setErrorMessage("Niepoprawne dane logowania!");
        }
    }

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>✕</button>
          <h2>Logowanie</h2>
          <form onSubmit={handleLogin}>
            <input 
                type="email" 
                placeholder="Email" 
                value ={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
            <input 
                type="password" 
                placeholder="Hasło" 
                value ={password}
                onChange={(e) => setPassword(e.target.value)}
                required />
            <button type="submit">Zaloguj się</button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    );
  };

  export default LoginModal;