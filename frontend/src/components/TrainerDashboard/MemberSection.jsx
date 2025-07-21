import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/Context";
import { toast, ToastContainer } from "react-toastify";
import UserWhite from "../../icons/UserWhite";

function MemberSection({ trainer_id }) {
  const { trainerToken } = useContext(AuthContext);
  const [memberDetails, setMemberDetails] = useState([]);
  useEffect(() => {
    const handleMemberDetail = async () => {
      const response = await fetch(
        `http://localhost:5000/api/member-section/${trainer_id}`,
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
      setMemberDetails(data.memberDetails);
    };
    handleMemberDetail();
  }, []);
  return (
    <>
      <ToastContainer autoClose={5000} position="top-right" />
      <button className="py-1 rounded-xl">My Members</button>
      <div className=" mt-3 mr-16 p-4 bg-white">
        <div className=" font-semibold text-2xl p-3">My Assigned Members</div>
        <div className="grid grid-cols-1 w-full">
          {memberDetails.map((val) => {
            return (
              <div className="bg-blue-50 flex gap-2 items-center p-4 ml-3">
                <div className="p-4 bg-blue-400 rounded-full">
                  <UserWhite />
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex justify-between w-full">
                    <div className="font-bold">{val.users.name}</div>
                    <div className="bg-green-300 text-green-900 font-semibold pl-4 pr-2">
                      {val.status[0].toUpperCase() + val.status.slice(1)}
                    </div>
                  </div>
                  <div className="flex justify-between w-full">
                    <div className="text-gray-500">{val.users.phone}</div>
                    <div className="text-gray-500">{val.plans.plan_name}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default MemberSection;
