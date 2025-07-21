import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import QuoteBox from "../components/QuoteBox";
import AdminWelcome from "../components/AdminDashboard/AdminWelcome";
import AdminLiveDataInfo from "../components/AdminDashboard/AdminLiveDataInfo";

function AdminDashboard() {
  return (
    <>
      <DashboardNavbar />
      <QuoteBox />
      <div className="min-h-screen bg-slate-100">
        
      <AdminWelcome />
      <AdminLiveDataInfo />
      </div>
    </>
  );
}

export default AdminDashboard;
