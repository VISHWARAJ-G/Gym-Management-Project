import React from "react";

function Bubbles() {
  return (
    <>
      <div className="absolute bg-green-200 h-28 w-28 top-40 left-40 rounded-full blur-xl animate-pulse overflow-hidden delay-0"></div>
      <div className="absolute bg-blue-200 h-28 w-28 bottom-40 right-40 rounded-full blur-xl animate-pulse overflow-hidden delay-400"></div>
    </>
  );
}

export default Bubbles;
