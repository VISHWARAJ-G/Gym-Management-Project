import React from "react";
import Logo from "../icons/Logo";
import { links } from "../services/NavLink";
import { Link } from "react-router-dom";

function Navbar() {
  const link = links;
  return (
    <nav className="flex items-center justify-between py-3 px-6 fixed top-0 left-0 w-full z-50 bg-white">
      <Link to={"/"} className="flex items-center gap-2">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
          <Logo />
        </div>
        <div className="font-bebas tracking-wider text-xl">Evolve Gym</div>
      </Link>
      <div className="flex gap-10 font-montserrat">
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
    </nav>
  );
}

export default Navbar;
