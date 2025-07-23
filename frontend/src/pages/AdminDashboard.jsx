import React, { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import QuoteBox from "../components/QuoteBox";
import AdminWelcome from "../components/AdminDashboard/AdminWelcome";
import AdminLiveDataInfo from "../components/AdminDashboard/AdminLiveDataInfo";

function AdminDashboard() {
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);
  return (
    <>
      <DashboardNavbar
        showBurgerMenu={showBurgerMenu}
        setShowBurgerMenu={setShowBurgerMenu}
      />
      <QuoteBox />
      <div className="min-h-screen bg-slate-100">
        <AdminWelcome />
        <AdminLiveDataInfo />
      </div>
    </>
  );
}

export default AdminDashboard;
