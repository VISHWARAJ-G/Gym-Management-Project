import React from "react";

function Timer() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-timer mt-[1.5px] h-6 w-6 text-orange-600"
      >
        <line x1="10" x2="14" y1="2" y2="2"></line>
        <line x1="12" x2="15" y1="14" y2="11"></line>
        <circle cx="12" cy="14" r="8"></circle>
      </svg>
    </>
  );
}

export default Timer;
