import React, { useContext } from "react";
import { AuthContext } from "../context/Context";
import { Navigate } from "react-router-dom";

function PrivateUserRoute({ children }) {
  const { isUserLoggedin, loading, signedUp } = useContext(AuthContext);
  if (loading) {
    return <div className="text-center text-2xl p-10">Checking login...</div>;
  }
  return isUserLoggedin ? children : signedUp ? children : <Navigate to="/" />;
}

export default PrivateUserRoute;