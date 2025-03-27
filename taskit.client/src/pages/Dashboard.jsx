import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../services/Api";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/User")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Błąd pobierania danych:", err));
  }, []);

  return (
    <div>
      <h1>Witaj, {user?.username}!</h1>
      <button className="btn register-btn" onClick={logout}>Wyloguj się</button>
    </div>
  );
};

export default Dashboard;
