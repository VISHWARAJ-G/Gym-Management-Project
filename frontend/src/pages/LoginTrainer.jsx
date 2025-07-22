import React from "react";
import TrainingLogo from "../icons/TrainingLogo";
import LoginForm from "../components/LoginForm";
import Bubbles from "../components/Bubbles";

function LoginTrainer({ setShowBurgerMenu }) {
  return (
    <>
      <div
        className="pt-24 bg-gray-100"
        onClick={() => setShowBurgerMenu(false)}
      >
        <Bubbles />
        <div className="flex justify-center">
          <div className="lg:p-10 lg:border-2 xs:p-4 xs:hover:shadow-[2px_2px_20px_rgb(0,0,0,0.5)] flex justify-center m-6 flex-col items-center transition-all xs:w-4/5 md:w-3/5 lg:w-1/2 w-full">
            <div className="bg-gradient-to-r from-blue-500 to-violet-500 p-4 rounded-2xl">
              <TrainingLogo />
            </div>
            <div>
              <h1 className="font-bebas m-3 lg:text-3xl text-xl font-extrabold">
                Trainer Login
              </h1>
            </div>
            <div>
              <h1 className="text-gray-500 tracking-wider lg:text-2xl text-sm">
                Enter your trainer credentials
              </h1>
            </div>
            <div className="w-full">
              <LoginForm value={"Trainer"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginTrainer;
