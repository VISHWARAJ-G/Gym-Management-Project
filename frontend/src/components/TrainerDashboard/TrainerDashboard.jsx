import React, { useContext, useEffect, useState } from "react";
import DashboardNavbar from "../DashboardNavbar";
import QuoteBox from "../QuoteBox";
import Welcome from "./Welcome";
import { AuthContext } from "../../context/Context";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import NoMemberDashboard from "./NoMemberDashboard";
import MemberDashboard from "./MemberDashboard";

function TrainerDashboard() {
  const { trainerToken } = useContext(AuthContext);
  const decoded_token = jwtDecode(trainerToken);
  const { trainer_id } = decoded_token;
  const [noMemberDashboard, setNoMemberDashboard] = useState(true);
  useEffect(() => {
    const handleMemberCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/member-count/${trainer_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${trainerToken}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          toast.error("Error:", data.message);
          return;
        }
        setNoMemberDashboard(data.count === 0);
      } catch (error) {
        toast.error("Catch Error:", error);
      }
    };
    handleMemberCount();
  }, []);
  return (
    <>
      <ToastContainer autoClose={5000} position="top-right" />
      <DashboardNavbar />
      <QuoteBox />
      <div className="bg-gray-100 pl-16 pt-7 pb-3">
        <Welcome />
        {noMemberDashboard ? (
          <NoMemberDashboard trainer_id={trainer_id} />
        ) : (
          <MemberDashboard trainer_id={trainer_id} />
        )}
      </div>
    </>
  );
}

export default TrainerDashboard;
