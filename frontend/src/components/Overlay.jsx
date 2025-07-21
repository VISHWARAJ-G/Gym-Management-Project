import React from "react";
import Logo from "../icons/Logo";
import { services } from "../services/ServiceBox";
import Arrow from "../icons/Arrow";
import { Link } from "react-router-dom";

function Overlay() {
  const mainBG = true;
  const servicesList = services;
  return (
    <section className="pt-20 relative bg-gray-950">
      <div className="absolute inset-0">
        <div className="absolute bg-gradient-to-r from-yellow-400 to-orange-500 h-28 w-28 top-40 left-40 rounded-full blur-3xl animate-pulse overflow-hidden delay-0"></div>
        <div className="absolute bg-gradient-to-r from-blue-900 to-violet-500 h-28 w-28 bottom-40 right-40 rounded-full blur-3xl animate-pulse overflow-hidden delay-400"></div>
        <div className="absolute bg-gradient-to-r from-green-500 to-teal-600 h-28 w-28 bottom-32 right-1/2 rounded-full blur-3xl animate-pulse overflow-hidden delay-800"></div>
      </div>
      <div className="relative z-10 text-white flex flex-col justify-center items-center p-10">
        <div className="flex mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-7 rounded-full  hover:scale-110 transition-all duration-300">
            <Logo mainBG={mainBG} dashboard={false} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-7xl tracking-wider font-bebas text-white pb-4">
            EVOLVE GYM
          </h1>
          <div className="h-[3px] w-3/4  bg-gradient-to-r from-yellow-400 to-orange-500 "></div>
        </div>
        <div>
          <h1 className="text-[2.8rem] mt-7 font-bebas">
            ALL-IN-ONE GYM MANAGEMENT PLATFORM
          </h1>
        </div>
        <div>
          <h2>
            <div className="text-center pt-1 tracking-wider text-xl">
              Simplify memberships, track progress, and grow stronger
            </div>
            <div className="text-center pt-1 tracking-wider text-xl">
              {" "}
              together with our comprehensive fitness management solution.
            </div>
          </h2>
        </div>
        <div className="mt-10 flex gap-10">
          {servicesList.map((val) => {
            const LogoName = val.logo;
            return (
              <Link
                className="group border-2 border-slate-700 py-10 px-5 flex flex-col items-center hover:scale-105 transition-all duration-300 backdrop-blur-xl bg-gray-900 rounded-2xl hover:bg-gray-800"
                key={val.name}
                to={
                  val.name === "Trainer Portal"
                    ? "/login-trainer"
                    : "/login-user"
                }
              >
                <div
                  className={`group-hover:rotate-3 bg-gradient-to-r p-6 rounded-2xl transition-all ${
                    val.name === "Trainer Portal"
                      ? "from-blue-500 to-violet-400"
                      : "from-green-500 to-blue-500"
                  }`}
                >
                  <LogoName dashboard={false} />
                </div>
                <div>
                  <h1 className="font-bebas text-2xl pt-3">{val.name}</h1>
                </div>
                <div className="max-w-[21rem] text-center tracking-wider text-xl p-2">
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
