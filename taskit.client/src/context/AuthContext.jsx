import { createContext, useEffect, useState, useContext } from "react";
import { loginUser, registerUser, changePassword } from "../services/AuthService";
import UserContext from "./UserContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authError, setAuthError] = useState(null);
  const [registerResult, setRegisterResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const clearAuthError = () => setAuthError(null);


  // Inicjalizacja po odświeżeniu strony
  useEffect(() => {
    const stored = localStorage.getItem("token");
    setIsAuthenticated(!!stored);
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", JSON.stringify(data));
      setIsAuthenticated(true);
      setAuthError(null);
      // Wywołujemy custom event, który spowoduje ponowne załadowanie danych użytkownika
      window.dispatchEvent(new Event('userLogin'));
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const result = await registerUser(userData);
      setRegisterResult(result.username);
      setAuthError(null);
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const changeUserPassword = async (oldPassword, newPassword) => {
    try {
      await changePassword(oldPassword, newPassword);
      setAuthError(null);
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Obsługa wylogowania - usuwanie wszystkiego z localStorage
  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false); 
    setAuthError(null);
    window.dispatchEvent(new Event("logout"));
    
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        logout,
        isAuthenticated,
        authError,
        registerResult,
        isLoading,
        clearAuthError,
        changeUserPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
