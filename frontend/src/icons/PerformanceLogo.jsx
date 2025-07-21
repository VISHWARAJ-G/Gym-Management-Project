import React from "react";

function PerformanceLogo() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-10 h-10 text-white"
      >
        <rect x="3" y="10" width="3" height="10" rx="1" fill="currentColor" />
        <rect x="9" y="6" width="3" height="14" rx="1" fill="currentColor" />
        <rect x="15" y="2" width="3" height="18" rx="1" fill="currentColor" />
        <path
          d="M3 20h18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
}

export default PerformanceLogo;
