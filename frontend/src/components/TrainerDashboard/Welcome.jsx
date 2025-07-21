import React, { useContext } from "react";
import { AuthContext } from "../../context/Context";
import { jwtDecode } from "jwt-decode";

function Welcome() {
  const { trainerToken } = useContext(AuthContext);
  const decoded_token = jwtDecode(trainerToken);
  const { name } = decoded_token;
  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold text-3xl">Welcome Trainer, {name}</div>
      <div className="text-lg text-gray-400">Manage your assigned members </div>
    </div>
  );
}

export default Welcome;
