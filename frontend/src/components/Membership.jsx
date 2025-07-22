import React, { useContext, useEffect } from "react";
import { planlist } from "../services/PlansList";
import TickLogo from "../icons/TickLogo";
import { AuthContext, PaymentContext, RefContext } from "../context/Context";
import { useNavigate } from "react-router-dom";

function Membership({ dashboard }) {
  const features = planlist;
  const { moveRef } = useContext(RefContext);
  const {
    isUserLoggedin,
    token,
    setToken,
    setSelectedPlan,
    selectedPlan,
    loading,
  } = useContext(AuthContext);
  const { setPayNowClicked } = useContext(PaymentContext);
  const navigate = useNavigate();

  if (loading) return null;

  console.log(isUserLoggedin);

  const selectPlan = (e, plan) => {
    if (!isUserLoggedin) {
      navigate("/login-user");
      return;
    }
    navigate("/payment-gateway");
    setSelectedPlan(plan);
    setToken(token);
  };
  return (
    <main
      id="plans"
      className={`${
        dashboard ? "" : "bg-blue-50"
      } flex flex-col items-center sm:py-14 sm:pt-20 py-4`}
      ref={moveRef}
    >
      <div>
        <h1 className="font-bebas sm:text-4xl text-2xl">
          CHOOSE YOUR MEMBERSHIP PLAN
        </h1>
      </div>
      <div>
        <h1 className="font-montserrat sm:text-xl text-sm text-center text-gray-500 mt-2">
          Flexible pricing options to fit your fitness journey
        </h1>
      </div>
      <div
        className={`m-10 w-full px-10 grid lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 gap-10`}
      >
        {features.map((val, ind) => {
          const perkList = val.perks;
          return (
            <div
              key={ind}
              className={`bg-white flex flex-col items-center xl:p-10 md:p-7 sm:p-5 p-3 rounded-2xl ${
                dashboard ? "" : "hover:scale-110"
              } transition-all ${
                val.duration === "6 months"
                  ? "relative border-2 border-blue-500 hover:shadow-[2px_2px_20px_rgb(59,130,246,0.7)]"
                  : "hover:shadow-[2px_2px_20px_rgb(0,0,0,0.7)]"
              }`}
            >
              <div className="font-bebas tracking-wide sm:text-2xl xs:text-sm">
                {val.duration}
              </div>
              <div className="font-bold sm:text-3xl text-lg text-blue-500">
                &#8377;{`${val.amount}`}
              </div>
              <div className="flex flex-col gap-3 p-5 sm:text-xl text-sm">
                {perkList.map((val) => {
                  return (
                    <div className="flex gap-2" key={val}>
                      <div>
                        <TickLogo perkList={true} />
                      </div>
                      <div className="text-gray-500">{val}</div>
                    </div>
                  );
                })}
              </div>
              <div>
                <button
                  name={`plan ${ind}`}
                  onClick={(e) => {
                    selectPlan(e, val);
                    setPayNowClicked(true);
                  }}
                  className={`py-4 px-10 font-bold text-sm sm:text-xl transition-all duration-700 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500`}
                >
                  {`Select Plan`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-center">
        <div>
          <h1 className="text-gray-500 sm:text-lg text-sm mb-3">
            Need a Custom Plan?
          </h1>
        </div>
        <div>
          <a
            href="tel:+919078565468"
            className="py-2 px-8 sm:text-xl text-sm text-blue-500 border-2 border-blue-500 rounded-3xl"
          >
            Contact GYM Support
          </a>
        </div>
      </div>
    </main>
  );
}

export default Membership;
