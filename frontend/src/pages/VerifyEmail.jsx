import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying");
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/verify-email/${token}`
        );
        const data = await response.json();

        if (
          data.message === "Email Verified" ||
          data.message === "Already Verified"
        ) {
          setStatus("Success");
          setTimeout(() => {
            navigate("/login-user");
          }, 5000);
        } else {
          setStatus("Error");
        }
      } catch (err) {
        toast.error("Verification Error:", err);
        setStatus("Error");
      }
    };
    verifyToken();
  }, [token, navigate]);
  return (
    <>
      <ToastContainer autoClose={5000} position="top-right"></ToastContainer>
      <div className="flex justify-center pt-24">
        {status === "Verifying" && (
          <div className="text-2xl font-bebas animate-pulse text-center">Loading...</div>
        )}
        {status === "Success" && (
          <div className="text-2xl font-bebas animate-pulse text-center">
            Signup Successful, Shortly we'll redirect you to login page...
          </div>
        )}
        {status === "Error" && (
          <div className="text-2xl font-bebas animate-pulse text-center">
            Invalid or Expired Link. Please signup again
          </div>
        )}
      </div>
    </>
  );
}

export default VerifyEmail;
