import React from "react";
import { Footerlinks, FooterLogos } from "../services/FooterLink";
import Logo from "../icons/Logo";

function Footer() {
  const links = Footerlinks;
  const logoNames = FooterLogos;
  return (
    <footer className="flex flex-col bg-gray-950 text-white py-10 px-20">
      <div className="grid grid-cols-4 my-5 mb-10 w-full">
        {links.map((val) => {
          const values = val.values;
          return (
            <div className="flex flex-col gap-2" key={val.name}>
              <h1 className="font-bebas text-xl">{val.name}</h1>
              {values.map((val) => {
                return (
                  <div key={val}>
                    <a href="#">{val}</a>
                  </div>
                );
              })}
            </div>
          );
        })}
        <div>
          <h1 className="font-bebas text-xl">Connect with us</h1>
          <div className="flex gap-3 my-4">
            {logoNames.map((Value) => {
              return (
                <a href="#" key={Value}>
                  <Value />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-lg">
            <Logo />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bebas tracking-widest">
              EVOLVE GYM
            </h1>
          </div>
        </div>
        <div className="text-xl text-gray-500">
          &copy; 2024 Evolve Gym. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
