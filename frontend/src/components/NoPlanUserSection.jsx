import React, { useContext, useRef } from "react";
import PlanLogo from "../icons/PlanLogo";
import Membership from "./Membership";
import { RefContext } from "../context/Context";

function NoPlanUserSection() {
  const { moveFunc } = useContext(RefContext);
  return (
    <>
      <div className="flex justify-center">
        <div className="bg-white hover:shadow-[2px_2px_20px_rgb(0,0,0,0.5)] flex justify-center items-center xl:w-3/4 my-8 py-9 px-6 mx-6">
          <div className="flex flex-col items-center">
            <div>
              <div className="p-4 rounded-full bg-yellow-200">
                <PlanLogo planSection={false} />
              </div>
            </div>
            <div>
              <h1 className="font-bold sm:text-xl text-sm tracking-wider my-2">
                No Active Plan
              </h1>
            </div>
            <div>
              <h1 className="text-gray-400 sm:text-xl text-center text-sm">
                Choose a plan to get started with your fitness journey and get
                access to all gym facilities.
              </h1>
            </div>
            <div>
              <button
                onClick={moveFunc}
                className="bg-gradient-to-r from-yellow-400 to-orange-600 px-5 py-2 mt-4 rounded-xl font-semibold sm:text-base text-sm"
              >
                Choose a Plan
              </button>
            </div>
          </div>
        </div>
      </div>
      <Membership dashboard={true} />
    </>
  );
}

export default NoPlanUserSection;
