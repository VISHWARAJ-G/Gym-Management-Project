import React from "react";
import Bubbles from "../components/Bubbles";
import UserLogo from "../icons/UserLogo";
import LoginForm from "../components/LoginForm";

function LoginUser({ setShowBurgerMenu }) {
  return (
    <div className="pt-24 bg-gray-100" onClick={() => setShowBurgerMenu(false)}>
      <Bubbles />
      <div className="flex justify-center">
        <div className="lg:p-10 lg:border-2 xs:p-4 xs:hover:shadow-[2px_2px_20px_rgb(0,0,0,0.5)] flex justify-center m-6 flex-col items-center transition-all xs:w-4/5 md:w-3/5 w-full">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-2xl">
            <UserLogo dashboard={false} />
          </div>
          <div>
            <h1 className="font-bebas m-3 lg:text-3xl text-xl font-extrabold">
              User Login
            </h1>
          </div>
          <div>
            <h1 className="text-gray-500 lg:text-2xl text-sm">
              Sign in to access your account
            </h1>
          </div>
          <div className="w-full">
            <LoginForm value={"User"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginUser;
