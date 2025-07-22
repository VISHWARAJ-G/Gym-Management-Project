import React, { useContext } from "react";
import { AuthContext } from "../context/Context";
import { jwtDecode } from "jwt-decode";

function Welcome({ showBurgerMenu, setShowBurgerMenu }) {
  const { token } = useContext(AuthContext);
  const decoded_token = jwtDecode(token);
  const { name, status } = decoded_token;
  return (
    <div
      className="lg:px-16 md:px-8 px-2 md:py-5 pt-24"
      onClick={() => setShowBurgerMenu(false)}
    >
      <div className="text-black font-bold lg:text-4xl text-xl">{`Welcome Back,${name}`}</div>
      <div className="tracking-wider text-gray-400 lg:text-xl text-sm py-3">
        {status === "Inactive"
          ? "Get started with your fitness journey"
          : "Continue your fitness journey"}
      </div>
    </div>
  );
}

export default Welcome;
