import React from "react";

function PlanLogo({ planSection }) {
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
        className={`lucide lucide-credit-card ${
          planSection === false ? "sm:h-12 sm:w-12 h-6 w-6 text-yellow-600" : "h-4 w-4"
        }`}
      >
        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
        <line x1="2" x2="22" y1="10" y2="10"></line>
      </svg>
    </>
  );
}

export default PlanLogo;
