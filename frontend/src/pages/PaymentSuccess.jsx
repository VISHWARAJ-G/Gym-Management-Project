import React, { useContext, useEffect, useRef, useState } from "react";
import TickLogo from "../icons/TickLogo";
import { AuthContext, DBContext } from "../context/Context";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const { token } = useContext(AuthContext);
  const { dbData, setDbData } = useContext(DBContext);
  const [countDown, setCountDown] = useState(5);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasStartedCountdown = useRef(false);

  useEffect(() => {
    const handleDbData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/payment-success",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          setError("DB Fetch Failed");
        } else setDbData(data.paidUser);
      } catch (err) {
        setError("API Error");
      } finally {
        setLoading(false);
      }
    };
    handleDbData();
  }, []);
  useEffect(() => {
    if (
      !loading &&
      !error &&
      dbData &&
      dbData.plans &&
      !hasStartedCountdown.current
    ) {
      hasStartedCountdown.current = true;
      const timer = setInterval(() => {
        setCountDown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/user-dashboard");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, error, dbData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!dbData || !dbData.plans) return <div>No plan found</div>;

  return (
    dbData &&
    dbData.plans && (
      <div className="flex justify-center bg-gray-100 min-h-screen">
        <div className="bg-white flex flex-col m-6 px-10 py-6 items-center justify-center">
          <div>
            <div className="p-5 bg-green-100 rounded-full">
              <TickLogo />
            </div>
          </div>
          <div className="text-center text-black font-bold text-2xl">
            <h1>Payment</h1>
            <h1>Successful!</h1>
          </div>
          <div className="text-green-500 font-montserrat my-2 font-extrabold">
            <h1>Your Plan has been Activated!</h1>
          </div>
          <div className="bg-green-100 flex flex-col items-center px-20 py-8 m-6 text-xl">
            <div>
              <h1>
                <span className="text-green-700 font-bold">Plan: </span>
                <span className="text-green-500">{`${dbData.plans?.plan_name}`}</span>
              </h1>
            </div>
            <div>
              <h1>
                <span className="text-green-700 font-bold">Amount Paid: </span>
                <span className="text-green-500">
                  &#8377;{`${dbData.plans?.plan_amount}`}
                </span>
              </h1>
            </div>
            <div>
              <h1>
                <span className="text-green-700 font-bold">Duration: </span>
                <span className="text-green-500">{`${dbData.plans?.plan_duration_label}`}</span>
              </h1>
            </div>
            <div>
              <h1>
                <span className="text-green-700 font-bold">Start Date: </span>
                <span className="text-green-500">{`${dbData.start_date}`}</span>
              </h1>
            </div>
          </div>
          <div>
            {`This page will close automatically in ${countDown} seconds`}
          </div>
        </div>
      </div>
    )
  );
}

export default PaymentSuccess;
