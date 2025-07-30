import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

function VerifyPage({ emailVal, setShowBurgerMenu }) {
  const [timeOut, setTimeOut] = useState(60);
  const [resend, setResend] = useState(false);
  useEffect(() => {
    const storedTime = localStorage.getItem("resendEmailExpiry");
    const now = Date.now();

    if (storedTime && now < parseInt(storedTime)) {
      const remaining = Math.floor((parseInt(storedTime) - now) / 1000);
      setTimeOut(remaining);
      setResend(false);
    } else {
      setTimeOut(0);
      setResend(true);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (timeOut > 0) {
      timer = setTimeout(() => {
        setTimeOut((prev) => prev - 1);
      }, 1000);
    } else {
      setResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeOut]);
  const handleResend = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/resend-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailVal }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Verification Email Resent");
        expiry = Date.now() + 60 * 1000;
        localStorage.setItem("resendEmailExpiry", expiry.toString());
        setTimeOut(60);
        setResend(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      toast.error("Resend Failed:", err);
    }
  };
  return (
    <>
      <ToastContainer autoClose={5000} position="top-right"></ToastContainer>
      <div
        className="pt-24 pb-8 flex justify-center bg-slate-50"
        onClick={() => setShowBurgerMenu(false)}
      >
        <div className="border-2 border-yellow-500 rounded-xl sm:p-10 p-3 m-10 flex flex-col items-center">
          <h1 className="lg:text-xl text-base">Almost There!</h1>
          <h1 className="font-semibold lg:text-base text-sm text-center">
            We’ve sent a verification link to your email.
          </h1>
          <h1 className="font-signika lg:text-2xl text-center text-lg sm:m-4 mt-3">
            Please click the link in your inbox to activate your account.
          </h1>
          <button
            onClick={handleResend}
            disabled={!resend}
            className={`mt-6 px-5 py-2 text-white rounded sm:text-base text-xs ${
              resend
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            {resend ? "Resend Mail" : `Resend mail in ${timeOut}s`}
          </button>
        </div>
      </div>
    </>
  );
}

export default VerifyPage;
