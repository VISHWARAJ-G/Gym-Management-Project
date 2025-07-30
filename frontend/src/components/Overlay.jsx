import React from "react";
import Logo from "../icons/Logo";
import { services } from "../services/ServiceBox";
import Arrow from "../icons/Arrow";
import { Link } from "react-router-dom";

function Overlay() {
  const mainBG = true;
  const servicesList = services;
  return (
    <section className="pt-20 relative bg-gray-950 min-w-full">
      <div className="absolute inset-0">
        <div className="absolute bg-gradient-to-r from-yellow-400 to-orange-500 h-28 w-28 top-40 left-40 rounded-full blur-3xl animate-pulse overflow-hidden delay-0"></div>
        <div className="absolute bg-gradient-to-r from-blue-900 to-violet-500 h-28 w-28 bottom-40 right-40 rounded-full blur-3xl animate-pulse overflow-hidden delay-400"></div>
        <div className="absolute bg-gradient-to-r from-green-500 to-teal-600 h-28 w-28 bottom-32 right-1/2 rounded-full blur-3xl animate-pulse overflow-hidden delay-800"></div>
      </div>
      <div className="relative z-10 text-white flex flex-col justify-center items-center sm:p-10 xs:p-7 p-3">
        <div className="flex sm:mb-5 md:mb-8 mb-2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 lg:p-7 sm:p-5 p-3 rounded-full hover:scale-110 transition-all duration-300">
            <Logo mainBG={mainBG} dashboard={false} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="lg:text-7xl sm:text-5xl xs:text-3xl text-2xl tracking-wider font-bebas text-white md:pb-4 pb-2">
            EVOLVE GYM
          </h1>
          <div className="h-[3px] w-3/4 bg-gradient-to-r from-yellow-400 to-orange-500 "></div>
        </div>
        <div>
          <h1 className="lg:text-[2.8rem] sm:text-4xl xs:text-2xl text-lg lg:mt-7 mt-3 font-bebas">
            ALL-IN-ONE GYM MANAGEMENT PLATFORM
          </h1>
        </div>
        <div className="flex justify-center items-center">
          <div className="text-center pt-1 tracking-wider md:w-4/5 lg:w-9/12 xs:pt-5 lg:text-xl xs:text-lg text-sm">
            Simplify memberships, track progress, and grow stronger together
            with our comprehensive fitness management solution.
          </div>
        </div>
        <div className="lg:mt-10 mt-5 grid md:grid-cols-2 lg:text-xl text-sm lg:gap-10 gap-5">
          {servicesList.map((val) => {
            const LogoName = val.logo;
            return (
              <Link
                className="group border-2 border-slate-700 sm:py-10 sm:px-5 py-5 flex flex-col items-center hover:scale-105 transition-all duration-300 backdrop-blur-xl bg-gray-900 rounded-2xl hover:bg-gray-800"
                key={val.name}
                to={
                  val.name === "Trainer Portal"
                    ? "/login-trainer"
                    : "/login-user"
                }
              >
                <div
                  className={`group-hover:rotate-3 bg-gradient-to-r sm:p-6 p-4 rounded-2xl transition-all ${
                    val.name === "Trainer Portal"
                      ? "from-blue-500 to-violet-400"
                      : "from-green-500 to-blue-500"
                  }`}
                >
                  <LogoName dashboard={false} />
                </div>
                <div>
                  <h1 className="font-bebas sm:text-2xl text-xl pt-3">
                    {val.name}
                  </h1>
                </div>
                <div className="max-w-[21rem] text-center tracking-wider lg:text-xl md:text-lg text-lg p-2 px-5">
                  <h1>{val.desc}</h1>
                </div>
                <div>
                  <h1 className="flex gap-2 text-blue-400">
                    {val.link}
                    <span className="inline-flex items-center">
                      <Arrow />
                    </span>
                  </h1>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Overlay;
