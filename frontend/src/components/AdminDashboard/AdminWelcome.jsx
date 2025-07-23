import React, { useContext } from "react";
import { AuthContext } from "../../context/Context";
import { jwtDecode } from "jwt-decode";

function AdminWelcome() {
  const { adminToken } = useContext(AuthContext);
  const decoded_token = jwtDecode(adminToken);
  const { name } = decoded_token;
  const splitted_name = name.split(" ")[0];
  return (
    <div className="md:px-16 md:pt-3 pt-28 px-2 sm:pb-3">
      <div className="text-black font-semibold md:text-4xl xs:text-2xl text-lg">{`Welcome Back,${splitted_name}`}</div>
      <div className="tracking-wider text-gray-400 md:text-xl xs:text-base text-xs py-3">
        Manage your gym operations efficiently
      </div>
    </div>
  );
}

export default AdminWelcome;
