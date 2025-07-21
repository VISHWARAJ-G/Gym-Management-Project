import React, { useContext } from "react";
import { AuthContext } from "../../context/Context";
import { jwtDecode } from "jwt-decode";

function AdminWelcome() {
  const { adminToken } = useContext(AuthContext);
  const decoded_token = jwtDecode(adminToken);
  const { name } = decoded_token;
  return (
    <div className="px-16 py-5">
      <div className="text-black font-semibold text-4xl">{`Welcome Back,${name}`}</div>
      <div className="tracking-wider text-gray-400 text-xl py-3">
        Manage your gym operations efficiently
      </div>
    </div>
  );
}

export default AdminWelcome;
