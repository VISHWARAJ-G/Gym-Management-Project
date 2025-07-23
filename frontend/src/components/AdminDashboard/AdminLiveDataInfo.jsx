import React, { useContext, useState } from "react";
import { buttons } from "../../services/AdminLiveData";
import AdminOverview from "./AdminOverview";
import AdminMembers from "./AdminMembers";
import AdminTrainers from "./AdminTrainers";
import { AdminContext } from "../../context/Context";
import AdminAddTrainer from "./AdminAddTrainer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminLiveDataInfo() {
  const buttonLinks = buttons;
  const { activeLink, setActiveLink } = useContext(AdminContext);
  const renderComponent = () => {
    switch (activeLink) {
      case "Overview":
        return <AdminOverview />;
      case "Users":
        return <AdminMembers />;
      case "Trainers":
        return <AdminTrainers />;
      case "Add Trainer":
        return <AdminAddTrainer />;
      default:
        return null;
    }
  };
  return (
    <>
      <div className="pb-6">
        <nav className="md:mx-16 mx-2 sm:flex hidden justify-between gap-1 bg-white rounded-3xl">
          {buttonLinks.map((val) => {
            return (
              <button
                key={val}
                className={`w-full p-4 rounded-xl transition-all ${
                  activeLink === val
                    ? "bg-black text-white"
                    : "hover:bg-gray-600 hover:text-white"
                }`}
                onClick={() => setActiveLink(val)}
              >
                {val}
              </button>
            );
          })}
        </nav>
        <div className="mt-4">{renderComponent()}</div>
      </div>
    </>
  );
}

export default AdminLiveDataInfo;
