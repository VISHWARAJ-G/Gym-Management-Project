import React, { useContext } from "react";
import { AuthContext } from "../context/Context";
import Logo from "../icons/Logo";
import { jwtDecode } from "jwt-decode";
import UserLogo from "../icons/UserLogo";
import Logout from "../icons/Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function DashboardNavbar({ showBurgerMenu, setShowBurgerMenu }) {
  const { adminToken, trainerToken } = useContext(AuthContext);
  if (!adminToken && !trainerToken) return null;
  const decoded_token = jwtDecode(trainerToken ? trainerToken : adminToken);
  const roleName = decoded_token?.role;
  const { name } = decoded_token;
  const { logout } = useContext(AuthContext);
  return (
    <nav
      className="z-50 flex bg-white/50 backdrop-blur-xl py-5 md:px-16 px-2 justify-between items-center fixed top-0 left-0 w-full"
      onClick={(e) => setShowBurgerMenu(false)}
    >
      <div className="flex justify-center gap-3">
        <div className="bg-gradient-to-r flex items-center from-yellow-300 to-orange-600 sm:px-3 p-2 rounded-xl">
          <Logo mainBG={false} dashboard={true} />
        </div>
        <div className="flex flex-col">
          <div>
            <h1 className="font-bebas sm:text-2xl text-lg tracking-wider">
              EVOLVE GYM
            </h1>
          </div>
          <div>
            <h1 className="font-montserrat sm:text-xl -ml-[.2rem] text-base text-gray-500">{`${
              roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase()
            } Portal`}</h1>
          </div>
        </div>
      </div>
      <div className="p-2 relative block sm:hidden text-2xl">
        <div
          onClick={(e) => {
            setShowBurgerMenu((prev) => !prev);
            e.stopPropagation();
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>

        <div
          className={`absolute right-0 top-full p-1 bg-white max-w-2xl transition-all duration-300 transform z-50 ${
            showBurgerMenu
              ? "opactiy-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="relative flex justify-start gap-2 items-center px-2 py-2">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 sm:p-2 p-1 rounded-full hover:bg-slate-100 hover:text-slate-700  transistion-all duration-300 hover:scale-105 whitespace-nowrap font-bold w-full">
              <UserLogo dashboard={true} />
            </div>
            <div className="sm:text-lg text-xs whitespace-nowrap text-gray-800">
              {name}
            </div>
          </div>
          <button
            className="flex items-center gap-2 px-2 py-2 text-gray-700 hover:bg-red-100 hover:text-red-700 rounded-xl transition-all duration-200 hover:scale-[1.02] ml-1 text-sm sm:text-lg w-full"
            onClick={logout}
          >
            <div className="p-1">
              <Logout />
            </div>
            <span className="pl-1">Logout</span>
          </button>
        </div>
      </div>
      <div className="gap-8 items-center hidden sm:flex">
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
