import React, { useContext } from "react";
import { AuthContext } from "../context/Context";
import { jwtDecode } from "jwt-decode";

function Welcome() {
  const { token } = useContext(AuthContext);
  const decoded_token = jwtDecode(token);
  const { name, status } = decoded_token;
  return (
    <div className="px-16 py-5">
      <div className="text-black font-bold text-4xl">{`Welcome Back,${name}`}</div>
      <div className="tracking-wider text-gray-400 text-xl py-3">
        {status === "Inactive"
          ? "Get started with your fitness journey"
          : "Continue your fitness journey"}
      </div>
    </div>
  );
}

export default Welcome;
