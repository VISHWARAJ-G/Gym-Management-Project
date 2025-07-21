import React from "react";
import Logo from "../icons/Logo";
import SignupForm from "../components/SignupForm";
import { Link } from "react-router-dom";

function SignupUser() {
  return (
    <div className="pt-24 bg-gray-100 w-full h-full pb-10">
      <div className="flex flex-col items-center bg-white w-fit mx-auto p-10 rounded-2xl hover:shadow-[2px_2px_20px_rgb(0,0,0,0.5)] transition-all">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-3xl  hover:scale-110 transition-all duration-300">
          <Logo mainBG={true} />
        </div>
        <div>
          <h1 className="font-bebas text-3xl tracking-wider m-5">
            CREATE MEMBER ACCOUNT
          </h1>
        </div>
        <div>
          <h1 className="text-yellow-600 text-2xl font-bold">
            Train. Transform. Triumph.
          </h1>
        </div>
        <div>
          <h1 className="m-5 text-xl text-gray-500">
            Join the fitness revolution
          </h1>
        </div>
        <SignupForm />
        <div className="mt-7 text-xl">
          Already have an account?{" "}
          <Link to={"/login-user"} className="text-yellow-600 font-extrabold">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupUser;
