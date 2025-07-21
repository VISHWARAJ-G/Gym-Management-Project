import React, { useContext } from "react";
import { AuthContext } from "../context/Context";
import { Navigate } from "react-router-dom";

function PrivateTrainerRoute({ children }) {
  const { isTrainerLoggedIn, loading } = useContext(AuthContext);
  if (loading)
    return <div className="text-center text-2xl p-10">Checking login...</div>;
  return isTrainerLoggedIn ? children : <Navigate to={"/"} />;
}

export default PrivateTrainerRoute;
