import { createContext, useEffect, useState } from "react";
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

    const storedUserRaw = localStorage.getItem("user");
    if (storedUserRaw) {
      try {
        const parsedUser = JSON.parse(storedUserRaw);
        setUser(parsedUser);
        setIsUserLoading(false);
        return;
      } catch {
        localStorage.removeItem("user");
      }
    }

    // API fallback
    try {
      const fetchedUser = await getCurrentUser();
      setUser(fetchedUser);
      localStorage.setItem("user", JSON.stringify(fetchedUser));
    } catch (err) {
      console.error("Błąd pobierania usera z API:", err);
      setUser(null);
      localStorage.removeItem("user");
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
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isUserLoading,
        userError,
        clearUser,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
