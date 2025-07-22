import React, { useContext } from "react";
import { AuthContext, PaymentContext } from "../context/Context";
import { Navigate } from "react-router-dom";

function PrivatePaymentGatewayRoute({ children }) {
  const { isUserLoggedin, loading } = useContext(AuthContext);
  if (loading) return null;

  return isUserLoggedin ? children : <Navigate to="/login-user" />;
}

export default PrivatePaymentGatewayRoute;
