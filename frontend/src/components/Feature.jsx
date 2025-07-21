import React from "react";
import { featureList } from "../services/FeatureList";

function Feature() {
  const Features = featureList;
  return (
    <section className="mx-5 my-16 flex flex-col items-center justify-center">
      <div>
        <h1 className="font-bebas text-[2.8rem]">
          POWERFUL FEATURES FOR YOUR GYM
        </h1>
      </div>
      <div className="font-montserrat tracking-wider text-2xl text-gray-500 mt-2">
        Everything you need to manage and grow your fitness business
      </div>
      <div className="m-10 grid grid-cols-3 gap-5">
        {Features.map((val) => {
          const LogoName = val.logo;
          return (
            <div
              key={val.name}
              className="flex justify-center flex-col items-center hover:shadow-[2px_2px_10px] hover:scale-105 transition-all p-5 w-72"
            >
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-5 rounded-3xl">
                <LogoName />
              </div>
              <div>
                <h1 className="font-bebas text-xl p-4 font-extrabold tracking-wider">
                  {val.name}
                </h1>
              </div>
              <div className="text-center text-xl text-gray-500">
                <h1>{val.desc}</h1>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Feature;
