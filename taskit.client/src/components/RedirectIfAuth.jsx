import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const RedirectIfAuthenticated = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default RedirectIfAuthenticated;
