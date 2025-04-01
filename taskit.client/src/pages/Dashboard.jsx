import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import UserContext from '../context/UserContext';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const { isUserLoading } = useContext(UserContext);

  if (isUserLoading) return null;

  return (
    <div>
      
      <button className="" onClick={logout}>Wyloguj się</button>
    </div>
  );
};

export default Dashboard;
