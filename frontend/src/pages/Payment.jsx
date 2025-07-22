import React, { useContext, useEffect, useState } from "react";
import Timer from "../icons/Timer";
import { QrCode } from "lucide-react";
import QrCodeLogo from "../icons/qrCodeLogo";
import { AuthContext, PaymentContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function Payment() {
  const { token, setToken, selectedPlan } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [paymentDone, setPaymentDoneNow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!paymentDone) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (window.opener) window.close();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [paymentDone]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handlePayment = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/payment-gateway",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan_name: selectedPlan.name,
            plan_amount: selectedPlan.amount,
            plan_duration: selectedPlan.days,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Payment failed");
        return;
      }

      try {
        const refreshResponse = await fetch(
          "http://localhost:5000/api/refresh-token",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const refreshed = await refreshResponse.json();

        if (refreshResponse.ok) {
          setPaymentDoneNow(true);

          localStorage.setItem("Token", refreshed.token);
          setToken(refreshed.token);

          navigate("/payment-success");
        }
        if (!refreshResponse.ok) {
          toast.error("Token Refresh Failed:", refreshed, message);
        }
      } catch (err) {
        toast.error("Refresh Request Error:", err);
      }
    } catch (err) {
      toast.error("Network / JS Error:", err);
      alert("Payment request failed. Please try again.");
    }
  };

  if (!selectedPlan) {
    return <div className="flex justify-center">Loading for Data</div>;
  }
  return (
    <>
      <ToastContainer autoClose={5000} position="top-right" />
      <div className="bg-gray-100">
        <div>
          <div className="text-center font-bold p-4 text-xl font-montserrat">
            Complete Payment
          </div>
          <div className="text-center text-gray-500">{`Plan : ${selectedPlan.name} • Amount : ${selectedPlan.amount}`}</div>
        </div>
        {!paymentDone ? (
          <div className="flex justify-center items-center w-full">
            <div className="bg-red-100 sm:m-4 m-2 py-2 rounded-2xl sm:text-xl text-base text-center w-1/2 border-2 border-red-300 text-red-700 flex gap-2 justify-center items-center">
              <Timer />
              <span className="inline-flex items-center">
                {`Time Remaining : ${formatTime(timeLeft)}`}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="bg-green-100 m-4 py-2 rounded-2xl text-xl w-1/2 border-2 border-green-300 text-green-700 flex gap-2 justify-center">
              Payment Done.. Will Redirect to Dashboard Soon
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <div className="grid sm:grid-cols-2 grid-cols-1 lg:p-10 p-2 gap-4 md:w-3/4 w-full">
            <div className="flex flex-col gap-2 px-5 py-10 text-xl items-center hover:shadow-[2px_2px_10px_rgb(0,0,0,0.5)] bg-white justify-center ">
              <div className="flex items-center gap-3">
                <QrCode /> <div className="font-bold"> Scan to Pay</div>
              </div>
              <div className="flex flex-col items-center px-8 py-16 bg-gray-200 m-4">
                <QrCodeLogo />
                <div className="text-sm text-gray-500 mt-1">
                  QR Code Will Appear Here
                </div>
                <div className="text-sm text-gray-500 mt-1">{`Generated for: ${selectedPlan.amount}`}</div>
              </div>
              <button
                onClick={handlePayment}
                className="bg-green-700 w-full py-3 rounded-3xl text-white"
              >
                Pay Now
              </button>
            </div>
            <div className="bg-white flex flex-col gap-2 py-10 text-xl hover:shadow-[2px_2px_10px_rgb(0,0,0,0.5)]">
              <div className="text-center font-bold">Pay Via UPI</div>
              <div className="flex flex-col items-start mx-10 gap-2">
                <label htmlFor="UPI">Enter UPI ID</label>
                <input
                  type="text"
                  name="upi"
                  id="UPI"
                  placeholder="yourname@upi"
                  className="p-3 rounded-lg border-2 w-full border-gray-200 focus:border-blue-500"
                />
              </div>
              <div className="bg-blue-100 flex flex-col mx-10 px-8 py-2 text-sm rounded-2xl items-start">
                <div>
                  <div>
                    <span className="text-blue-800 font-bold font-montserrat">
                      Amount:
                    </span>{" "}
                    &#8377;{`${selectedPlan.amount}`}
                  </div>
                  <div>
                    <span className="text-blue-800 font-bold font-montserrat">
                      Plan:
                    </span>{" "}
                    {`${selectedPlan.duration}`}
                  </div>
                </div>
              </div>
              <div className="text-base mx-10 text-gray-500 text-center">
                Use your UPI app to complete the payment
              </div>
              <button
                disabled
                className="bg-gray-300 text-white font-bold text-center mx-10 px-8 py-2 text-sm rounded-2xl items-start"
              >
                Pay with UPI
              </button>
              <div className="text-sm text-center text-gray-500 my-6">
                Secure payment powered by UPI
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center p-1">
          <div className="border-2 border-gray-300 text-sm text-center text-gray-500 px-7">
            By proceeding with payment, you agree to our terms and conditions.
            Your plan will be activated immediately after successful payment.
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;
