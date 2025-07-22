import React from "react";
import Logo from "../icons/Logo";
import SignupForm from "../components/SignupForm";
import { Link } from "react-router-dom";

function SignupUser({ setShowBurgerMenu }) {
  return (
    <div
      className="pt-24 bg-gray-100 w-full pb-10 px-4"
      onClick={() => setShowBurgerMenu(false)}
    >
      <div className="flex flex-col items-center bg-white md:w-fit w-full md:mx-auto md:p-10 p-3 rounded-2xl hover:shadow-[2px_2px_20px_rgb(0,0,0,0.5)] transition-all">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 lg:p-4 p-2 lg:rounded-3xl rounded-xl  hover:scale-110 transition-all duration-300">
          <Logo mainBG={true} />
        </div>
        <div>
          <h1 className="font-bebas lg:text-3xl sm:text-xl text-base tracking-wider lg:m-5 mt-3">
            CREATE MEMBER ACCOUNT
          </h1>
        </div>
        <div>
          <h1 className="text-yellow-600 lg:text-2xl sm:text-lg text-base font-bold">
            Train. Transform. Triumph.
          </h1>
        </div>
        <div>
          <h1 className="lg:m-5 sm:m-2 lg:text-xl mb-3 sm:text-base text-gray-500">
            Join the fitness revolution
          </h1>
        </div>
        <SignupForm />
        <div className="lg:mt-7 mt-2 lg:text-xl text-base">
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
