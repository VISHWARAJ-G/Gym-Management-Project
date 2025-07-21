import React, { useContext } from "react";
import { PaymentContext } from "../context/Context";
import { Navigate } from "react-router-dom";

function PrivatePaymentCompleted({ children }) {
  const { paymentDone } = useContext(PaymentContext);
  return paymentDone ? { children } : <Navigate to={"/user-dashboard"} />;
}

export default PrivatePaymentCompleted;
