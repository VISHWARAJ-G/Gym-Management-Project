import React from "react";

function Logo({ mainBG, dashboard }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-dumbbell text-black ${
        mainBG ? "h-14 w-14" : dashboard ? "h-9 w-9" : "h-6 w-6"
      }`}
    >
      <path d="M14.4 14.4 9.6 9.6"></path>
      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"></path>
      <path d="m21.5 21.5-1.4-1.4"></path>
      <path d="M3.9 3.9 2.5 2.5"></path>
      <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"></path>
    </svg>
  );
}

export default Logo;
