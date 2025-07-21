import React from "react";
import Bubbles from "../components/Bubbles";
import UserLogo from "../icons/UserLogo";
import LoginForm from "../components/LoginForm";

function LoginUser() {
  return (
    <div className="pt-24 bg-gray-100">
      <Bubbles />
      <div className="flex justify-center">
        <div className="p-10 w-1/2 border-2 hover:shadow-[2px_2px_20px_rgb(0,0,0,0.5)] flex justify-center m-6 flex-col items-center transition-all">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-2xl">
            <UserLogo dashboard={false}/>
          </div>
          <div>
            <h1 className="font-bebas m-3 text-3xl font-extrabold">
              User Login
            </h1>
          </div>
          <div>
            <h1 className="text-gray-500 text-2xl">
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
