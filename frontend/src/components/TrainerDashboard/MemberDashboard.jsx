import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/Context";
import { memberDetail } from "../../services/MemberDetail";
import MemberSection from "./MemberSection";
import { ToastContainer } from "react-toastify";

function MemberDashboard({ trainer_id, setShowBurgerMenu, showBurgerMenu }) {
  const { trainerToken } = useContext(AuthContext);
  const [member, setMember] = useState(0);
  const [activeMember, setActiveMember] = useState(0);
  const [renewalMember, setRenewalMember] = useState(0);
  useEffect(() => {
    const handleMemberDetail = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/member-detail-count/${trainer_id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${trainerToken}` },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error("Error:", data.message);
        return;
      }
      setActiveMember(data.activeMembersCount);
      setMember(data.membersCount);
      setRenewalMember(data.renewalMemberCount);
    };
    handleMemberDetail();
  }, []);
  const memberDetails = memberDetail(activeMember, member, renewalMember);
  return (
    <>
      <ToastContainer autoClose={5000} position="top-right" />
      <div
        className="my-4 grid sm:grid-cols-3 tiny:grid-cols-2 grid-cols-1 gap-10 px-4 md:px-0"
        onClick={() => setShowBurgerMenu(false)}
      >
        {memberDetails.map((val) => {
          const Logo = val.logo;
          return (
            <div className="p-4 bg-white flex flex-col items-start hover:shadow-[0px_0px_10px_rgb(0,0,0,0.5)]">
              <div className="flex justify-between w-full items-center">
                <span className="font-semibold xs:text-sm tiny:text-xs hidden xs:block">
                  {val.boxName}
                </span>
                <span className="font-semibold text-sm block xs:hidden">
                  {val.alterName}
                </span>
                <Logo />
              </div>
              <div
                className={`font-bebas md:text-4xl text-2xl mt-4 ${
                  val.colorName === "green"
                    ? "text-green-700"
                    : val.colorName === "yellow"
                    ? "text-yellow-600"
                    : "text-black"
                }`}
              >
                {val.mainCount}
              </div>
            </div>
          );
        })}
      </div>
      <MemberSection
        trainer_id={trainer_id}
        setShowBurgerMenu={setShowBurgerMenu}
      />
    </>
  );
}

export default MemberDashboard;
