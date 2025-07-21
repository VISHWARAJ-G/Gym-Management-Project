import React, { useContext, useState } from "react";
import { AuthContext } from "../context/Context";
import Logo from "../icons/Logo";
import { jwtDecode } from "jwt-decode";
import UserLogo from "../icons/UserLogo";
import Logout from "../icons/Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

function UserDashboardNavbar({
  isDropDown,
  setIsDropDown,
  overlay,
  setOverlay,
}) {
  const { user } = useContext(AuthContext);
  if (!user) return null;
  const { role: roleName, name } = user;
  const { logout } = useContext(AuthContext);
  return (
    <>
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
                roleName.charAt(0).toUpperCase() +
                roleName.slice(1).toLowerCase()
              } Portal`}</h1>
            </div>
          </div>
        </div>
        <div
          className="relative text-left"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={(e) => {
              setIsDropDown((prev) => !prev);
            }}
          >
            <div className="relative flex gap-2 items-center px-4 py-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-full">
                <UserLogo dashboard={true} />
              </div>
              <div className="font-bold text-lg text-gray-800">{name}</div>
            </div>

            <div
              className={`-ml-1 text-gray-400 mt-[.1rem] mr-3 transition-transform duration-300 ${
                isDropDown ? "rotate-180" : ""
              }`}
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </div>
          </div>

          <div
            className={`absolute top-full mt-2 bg-white shadow-xl rounded-xl p-3 flex flex-col gap-3 transition-all duration-300 transform z-20 right-2
          ${
            isDropDown
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }
        `}
          >
            <button
              className="flex items-center w-full gap-2 px-3 py-2 text-gray-700 hover:bg-green-100 hover:text-green-700 rounded-xl transition-all duration-200 hover:scale-[1.02] whitespace-nowrap"
              onClick={(e) => {
                e.stopPropagation();
                setOverlay(true);
              }}
            >
              <UserLogo dashboard={true} />
              <span>Personalize your Account</span>
            </button>

            <button
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-red-100 hover:text-red-700 rounded-xl transition-all duration-200 hover:scale-[1.02] ml-1"
              onClick={logout}
            >
              <Logout />
              <span className="pl-1">Logout</span>
            </button>
          </div>
        </div>
      </nav>
      {}
    </>
  );
}

export default UserDashboardNavbar;
