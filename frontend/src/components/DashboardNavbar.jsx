import React, { useContext } from "react";
import { AuthContext } from "../context/Context";
import Logo from "../icons/Logo";
import { jwtDecode } from "jwt-decode";
import UserLogo from "../icons/UserLogo";
import Logout from "../icons/Logout";

function DashboardNavbar() {
  const { adminToken, trainerToken } = useContext(AuthContext);
  if (!adminToken && !trainerToken) return null;
  const decoded_token = jwtDecode(trainerToken ? trainerToken : adminToken);
  const roleName = decoded_token?.role;
  const { name } = decoded_token;
  const { logout } = useContext(AuthContext);
  return (
    <nav className="z-50 flex bg-white/50 backdrop-blur-xl py-5 px-16 justify-between items-center fixed top-0 left-0 w-full">
      <div className="flex justify-center gap-3">
        <div className="bg-gradient-to-r flex items-center from-yellow-300 to-orange-600 px-3 rounded-xl">
          <Logo mainBG={false} dashboard={true} />
        </div>
        <div className="flex flex-col">
          <div>
            <h1 className="font-bebas text-2xl tracking-wider">EVOLVE GYM</h1>
          </div>
          <div>
            <h1 className="font-montserrat text-xl text-gray-500">{`${
              roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase()
            } Portal`}</h1>
          </div>
        </div>
      </div>
      <div className="flex gap-8 items-center">
        <div className="flex gap-2 items-center px-4 py-2">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-full">
            <UserLogo dashboard={true} />
          </div>
          <div className="font-bold text-lg">{name}</div>
        </div>
        <div className="">
          <button
            className="font-montserrat flex gap-3 border-2 border-gray-300 px-4 py-2 hover:bg-red-100 hover:border-red-200 hover:text-red-700 rounded-2xl"
            onClick={logout}
          >
            <Logout /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
