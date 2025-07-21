import React, { useContext } from "react";
import { PaymentContext } from "../context/Context";
import { Navigate } from "react-router-dom";

function PrivatePaymentGatewayRoute({ children }) {
  const { payNowClicked } = useContext(PaymentContext);
  return payNowClicked ? children : <Navigate to={"/user-dashboard"} />;
}

export default PrivatePaymentGatewayRoute;
