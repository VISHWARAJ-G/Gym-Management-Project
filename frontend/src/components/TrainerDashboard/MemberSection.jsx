import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/Context";
import { toast, ToastContainer } from "react-toastify";
import UserWhite from "../../icons/UserWhite";

function MemberSection({ trainer_id, setShowBurgerMenu }) {
  const { trainerToken } = useContext(AuthContext);
  const [memberDetails, setMemberDetails] = useState([]);
  useEffect(() => {
    const handleMemberDetail = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/member-section/${trainer_id}`,
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
      <div onClick={() => setShowBurgerMenu(false)}>
        <button className="py-1 rounded-xl font-bold text-gray-600 px-4">
          My Members
        </button>
        <div className=" mt-3 sm:p-4 bg-white m-3 p-3">
          <div className=" font-semibold sm:text-2xl text-base p-4">
            My Assigned Members
          </div>
          <div className="grid grid-cols-1 gap-2 w-full">
            {memberDetails.map((val) => {
              return (
                <div className="bg-blue-50 flex gap-2 items-center p-4 ml-3">
                  <div className="sm:p-4 p-2 bg-blue-400 rounded-full">
                    <UserWhite />
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between w-full">
                      <div className="font-bold sm:text-base text-xs">
                        {val.users.name}
                      </div>
                      <div className="bg-green-300 text-green-900 font-semibold md:pl-3 sm:pl-2 xs:pl-2 pl-2 sm:pr-0 sm:text-base text-xs">
                        {val.status[0].toUpperCase() + val.status.slice(1)}
                      </div>
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="text-gray-500 sm:text-base text-xs">
                        {val.users.phone}
                      </div>
                      <div className="text-gray-500 sm:text-base text-xs">
                        {val.plans.plan_name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default MemberSection;
