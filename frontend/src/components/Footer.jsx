import React from "react";
import { Footerlinks, FooterLogos } from "../services/FooterLink";
import Logo from "../icons/Logo";

function Footer() {
  const links = Footerlinks;
  const logoNames = FooterLogos;
  return (
    <footer className="flex flex-col bg-gray-950 text-white sm:py-10 sm:px-20 py-3">
      <div className="flex justify-center w-full">
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-10 grid-cols-1 gap-10 my-5 mb-10 w-full">
          {links.map((val) => {
            const values = val.values;
            return (
              <div className="flex flex-col gap-2 items-center" key={val.name}>
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
          <div className="lg:col-start-auto sm:col-start-2">
            <div className="flex flex-col items-center">
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
        </div>
      </div>

      <div className="flex justify-between items-center sm:flex-row sm:gap-10 px-5 flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-1 rounded-lg">
            <Logo />
          </div>
          <div>
            <h1 className="text-white sm:text-2xl font-bebas tracking-widest text-sm ">
              EVOLVE GYM
            </h1>
          </div>
        </div>
        <div className=" text-gray-500 text-sm">
          &copy; 2024 Evolve Gym,Inc.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
