import React, { useContext } from "react";
import { AuthContext } from "../context/Context";
import { Navigate } from "react-router-dom";

function PrivateAdminRoute({ children }) {
  const { isAdminLoggedIn, loading } = useContext(AuthContext);
  if (loading)
    return <div className="text-center text-2xl p-10">Checking login...</div>;
  return isAdminLoggedIn ? children : <Navigate to={"/"} />;
}

export default PrivateAdminRoute;
