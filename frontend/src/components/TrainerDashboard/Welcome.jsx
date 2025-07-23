import React, { useContext } from "react";
import { AuthContext } from "../../context/Context";
import { jwtDecode } from "jwt-decode";

function Welcome({ setShowBurgerMenu, showBurgerMenu }) {
  const { trainerToken } = useContext(AuthContext);
  const decoded_token = jwtDecode(trainerToken);
  const { name } = decoded_token;
  const splitted_name = name.split(" ")[0];
  return (
    <div
      className="flex flex-col gap-2 pt-24 md:pt-0 md:px-0 px-4"
      onClick={() => setShowBurgerMenu(false)}
    >
      <div className="font-semibold md:text-3xl xs:text-xl text-base">
        Welcome Trainer, {splitted_name}
      </div>
      <div className="md:text-lg text-base text-gray-400">
        Manage your assigned members{" "}
      </div>
    </div>
  );
}

export default Welcome;
