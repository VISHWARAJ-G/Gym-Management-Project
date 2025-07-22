import React, { useState } from "react";
import Logo from "../icons/Logo";
import { linkLogo, links } from "../services/NavLink";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function Navbar({ showBurgerMenu, setShowBurgerMenu }) {
  const link = links;
  const linksLogo = linkLogo;
  return (
    <nav
      className="flex items-center justify-between py-3 sm:px-6 px-2 fixed top-0 left-0 right-0 z-50 bg-white"
      onClick={() => {
        setShowBurgerMenu(false);
      }}
    >
      <Link to={"/"} className="flex items-center gap-2">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
          <Logo />
        </div>
        <div className="font-bebas tracking-wider text-xl">Evolve Gym</div>
      </Link>
      <div className="sm:flex gap-10 font-montserrat hidden">
        {link.map((val) => {
          return (
            <a
              href={val === "plans" ? "#plans" : "#"}
              className="text-gray-500 hover:text-gray-900 font-bold transition-colors"
              key={val}
            >
              {val.toUpperCase()}
            </a>
          );
        })}
      </div>
      <div className="p-2 relative block sm:hidden">
        <div
          onClick={(e) => {
            setShowBurgerMenu((prev) => !prev);
            e.stopPropagation();
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>

        <div
          className={`absolute right-0 top-full p-1 bg-white transition-all duration-300 transform z-50 ${
            showBurgerMenu
              ? "opactiy-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          {linksLogo.map((val) => {
            const Logo = val.Logo;
            return (
              <a
                href={val.name === "plans" ? "#plans" : "#"}
                key={val.name}
                className="flex items-center justify-around w-full gap-4 px-3 py-2 text-gray-700 hover:bg-slate-100 hover:text-slate-700  transistion-all duration-300 hover:scale-105 whitespace-nowrap font-bold"
              >
                <FontAwesomeIcon
                  icon={Logo}
                  className="text-gray-700 hover:text-slate-700"
                />
                <span>{val.name.toUpperCase()}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
