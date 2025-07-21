import React, { useContext } from "react";
import UserLogo from "../../icons/UserLogo";
import DownloadLogo from "../../icons/DownloadLogo";
import { AdminContext, AuthContext } from "../../context/Context";
import {
  handleTrainerDownloadFunc,
  handleUserDownloadFunc,
} from "../../services/ReportCall";

function ReportsDownload() {
  const { setActiveLink } = useContext(AdminContext);
  const { adminToken } = useContext(AuthContext);
  const handleUserDownload = () => {
    handleUserDownloadFunc(adminToken);
  };
  const handleTrainerDownload = () => {
    handleTrainerDownloadFunc(adminToken);
  };
  return (
    <>
      <div className="flex flex-col items-start mt-2 w-full">
        <div className="text-center w-full py-3">
          <button
            onClick={() => setActiveLink("Add Trainer")}
            className="flex justify-center items-center gap-2 text-base w-full py-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 font-bold"
          >
            <UserLogo dashboard={true} /> Add New Trainer
          </button>
        </div>
        <div className="text-center w-full py-3 rounded-full ">
          <button
            onClick={handleUserDownload}
            className="text-base flex items-center justify-center gap-2 w-full border-2 border-slate-400 hover:border-yellow-600 font-bold rounded-full py-2"
          >
            <DownloadLogo /> Export All Users
          </button>
        </div>
        <div className="text-center w-full py-3 rounded-full ">
          <button
            onClick={handleTrainerDownload}
            className="text-base flex items-center justify-center gap-2 w-full border-2 border-slate-400 hover:border-red-600 font-bold rounded-full py-2"
          >
            <DownloadLogo /> Export All Trainers
          </button>
        </div>
      </div>
    </>
  );
}

export default ReportsDownload;
