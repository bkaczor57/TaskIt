import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import UserContext from "../context/UserContext";
import "../styles/LandingPage.css";
import LoginModal from "../components/modals/LoginModal"
import RegisterModal from "../components/modals/RegisterModal"


const LandingPage = () => {
    const { logout } = useContext(AuthContext);
    const { user, isUserLoading } = useContext(UserContext);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister,setShowRegister] = useState(false);
    const navigate = useNavigate();

    if (isUserLoading) return null;

     return (
    <div className="landing-container">
      <div className="content">
        <h1>TaskIt</h1>
        <p>Organizuj zadania zespołowe w jednym miejscu.</p>
        {user && (
          <p className="greeting-text">Witaj, {user.username}!</p>
        )}
        <div className="form-buttons">
          {user ? (
            <>
              
              <button className="btn-green " onClick={() => navigate("/dashboard")}>
                Przejdź do Dashboardu
              </button>
              <button className="btn-danger" onClick={logout}>Wyloguj się</button>
              
            </>
          ) : (
            <>
              <button className="btn-full-width btn-outline-blue" onClick={() => setShowLogin(true)}>Zaloguj się</button>
              <button className="btn-full-width btn-orange " onClick={() => setShowRegister(true)}>Zarejestruj się</button>
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
