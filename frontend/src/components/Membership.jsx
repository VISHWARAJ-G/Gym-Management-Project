import React, { useContext, useEffect } from "react";
import { planlist } from "../services/PlansList";
import TickLogo from "../icons/TickLogo";
import { AuthContext, PaymentContext, RefContext } from "../context/Context";
import { useNavigate } from "react-router-dom";

function Membership({ dashboard }) {
  const features = planlist;
  const { moveRef } = useContext(RefContext);
  const { isUserLoggedin, token, setToken, setSelectedPlan, selectedPlan } =
    useContext(AuthContext);
  const { setPayNowClicked } = useContext(PaymentContext);
  const navigate = useNavigate();

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
      } flex flex-col items-center py-14 pt-20`}
      ref={moveRef}
    >
      <div>
        <h1 className="font-bebas text-4xl">CHOOSE YOUR MEMBERSHIP PLAN</h1>
      </div>
      <div>
        <h1 className="font-montserrat tracking-wider text-xl text-gray-500 mt-2">
          Flexible pricing options to fit your fitness journey
        </h1>
      </div>
      <div
        className={`m-10 grid grid-cols-3 gap-10 ${
          dashboard ? "w-full px-6" : "w-3/4"
        }`}
      >
        {features.map((val, ind) => {
          const perkList = val.perks;
          return (
            <div
              key={ind}
              className={`bg-white flex flex-col items-center p-10 rounded-2xl ${
                dashboard ? "" : "hover:scale-110"
              } transition-all ${
                val.duration === "6 months"
                  ? "relative border-2 border-blue-500 hover:shadow-[2px_2px_20px_rgb(59,130,246,0.7)]"
                  : "hover:shadow-[2px_2px_20px_rgb(0,0,0,0.7)]"
              }`}
            >
              <div
                className={`${val.duration === "6 months" ? "block" : "hidden"}
                absolute -top-5 px-10 py-1 bg-blue-500 rounded-full text-white font-bold tracking-wider text-xl
                `}
              >
                Popular
              </div>
              <div className="font-bebas tracking-wide text-2xl">
                {val.duration}
              </div>
              <div className="font-bold text-3xl text-blue-500">
                &#8377;{`${val.amount}`}
              </div>
              <div className="flex flex-col gap-3 p-5 text-xl">
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
                  className={`py-4 px-10 font-bold text-xl transition-all duration-700 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500`}
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
          <h1 className="text-gray-500 text-lg mb-3">Need a Custom Plan?</h1>
        </div>
        <div>
          <a
            href="tel:+919078565468"
            className="py-2 px-8 text-xl text-blue-500 border-2 border-blue-500 rounded-3xl"
          >
            Contact GYM Support
          </a>
        </div>
      </div>
    </main>
  );
}

export default Membership;
