import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user); 
    }
    setIsLoading(false);

    const handleLogoutEvent = () => {
      logout();
      navigate("/");
    };

    window.addEventListener("logout", handleLogoutEvent);
    return () => {
      window.removeEventListener("logout", handleLogoutEvent);
    };
    
  }, []);



  const login = (userData) => {
    localStorage.setItem("token", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout , isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
