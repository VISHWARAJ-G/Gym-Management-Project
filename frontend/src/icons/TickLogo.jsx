import React from "react";

function TickLogo({ perkList }) {
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
        className={`lucide lucide-circle-check-big ${
          perkList ? "h-5 w-5 mr-2 mt-2" : "h-10 w-10"
        } text-green-500`}
      >
        <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
        <path d="m9 11 3 3L22 4"></path>
      </svg>
    </>
  );
}

export default TickLogo;
