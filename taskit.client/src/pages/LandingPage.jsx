import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/LandingPage.css";
import LoginModal from "../components/LoginModal"
import RegisterModal from "../components/RegisterModal"


const LandingPage = () => {
    const { user,logout } = useContext(AuthContext);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister,setShowRegister] = useState(false);
     const navigate = useNavigate();

     return (
    <div className="landing-container">
      <div className="content">
        <h1>TaskIt</h1>
        <p>Organizuj zadania zespołowe w jednym miejscu.</p>
        {user && (
          <p className="greeting-text">Witaj, {user.username}!</p>
        )}
        <div className="buttons">
          {user ? (
            <>
              
              <button className="btn login-btn" onClick={() => navigate("/dashboard")}>
                Przejdź do Dashboardu
              </button>
              <button className="btn register-btn" onClick={logout}>Wyloguj się</button>
              
            </>
          ) : (
            <>
              <button className="btn login-btn" onClick={() => setShowLogin(true)}>Zaloguj się</button>
              <button className="btn register-btn" onClick={() => setShowRegister(true)}>Zarejestruj się</button>
            </>
          )}
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
       {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />} 
    </div>
  );
};

export default LandingPage;
