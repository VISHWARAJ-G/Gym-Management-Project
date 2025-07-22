import React from "react";

function Bubbles() {
  return (
    <>
      <div className="absolute bg-green-300/50 h-28 w-28 xs:top-40 top-20 lg:left-40 left-5 rounded-full blur-xl animate-bounce overflow-hidden delay-0"></div>
      <div className="absolute bg-blue-300/50 h-28 w-28 xs:bottom-40 bottom-5 lg:right-40 right-5 rounded-full blur-xl animate-bounce overflow-hidden delay-400 sm:block hidden"></div>
    </>
  );
}

export default Bubbles;
