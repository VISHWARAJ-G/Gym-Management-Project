import React from "react";
import TrainingLogo from "../icons/TrainingLogo";
import LoginForm from "../components/LoginForm";
import Bubbles from "../components/Bubbles";

function LoginTrainer() {
  return (
    <>
      <div className="pt-24 bg-gray-100 relative">
        <Bubbles />
        <div className="flex justify-center">
          <div className="p-10 border-2 hover:shadow-[2px_2px_20px_rgb(0,0,0,0.5)] flex justify-center m-6 flex-col items-center transition-all w-1/2">
            <div className="bg-gradient-to-r from-blue-500 to-violet-500 p-6 rounded-2xl">
              <TrainingLogo />
            </div>
            <div>
              <h1 className="font-bebas m-3 text-3xl font-extrabold">
                Trainer Login
              </h1>
            </div>
            <div>
              <h1 className="text-gray-500 tracking-wider text-2xl">
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
