import { createContext, useEffect, useState, useContext } from "react";
import { getCurrentUser } from "../services/UserService";

const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  const loadUser = async () => {
    const tokenRaw = localStorage.getItem("token");
    if (!tokenRaw) {
      setUser(null);
      setIsUserLoading(false);
      return;
    }

    

    const storedUserRaw = sessionStorage.getItem("user");
    if (storedUserRaw) {
      try {
        const parsedUser = JSON.parse(storedUserRaw);
        setUser(parsedUser);
        setIsUserLoading(false);
        return;
      } catch {
        sessionStorage.removeItem("user");
      }
    }

    // API fallback
    try {
      const fetchedUser = await getCurrentUser();
      setUser(fetchedUser);
      sessionStorage.setItem("user", JSON.stringify(fetchedUser));
    } catch (err) {
      console.error("Błąd pobierania usera z API:", err);
      setUser(null);
      sessionStorage.removeItem("user");
    } finally {
      setIsUserLoading(false);
    }
  };

  

  useEffect(() => {
    loadUser();

    const handleUserLogin = () => {
      loadUser();
    };

    window.addEventListener("userLogin", handleUserLogin);
    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, []);

  const clearUser = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isUserLoading,
        userError,
        clearUser,
        setUser,
        loadUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};


export default UserContext;
