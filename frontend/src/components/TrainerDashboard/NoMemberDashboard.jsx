import React from "react";
import NoUserLogo from "../../icons/NoUserLogo";

function NoMemberDashboard({ trainer_id, setShowBurgerMenu, showBurgerMenu }) {
  return (
    <div
      className="flex mt-5 items-center justify-center"
      onClick={() => setShowBurgerMenu(false)}
    >
      <div className="bg-white rounded-2xl hover:shadow-[0px_0px_10px_rgb(0,0,0,0.6)] flex flex-col justify-center items-center max-w-3xl text-center gap-2 sm:px-10 m-4 px-4 py-4">
        <div>
          <div className="p-2 rounded-full bg-gray-200">
            <NoUserLogo />
          </div>
        </div>
        <div className="font-semibold sm:text-xl xs:text-base text-sm text-center">
          No Members Assigned Yet
        </div>
        <div className="flex flex-col gap-2 text-gray-600">
          <div className="font-poppins-dashboard sm:text-xl text-sm max-w-lg">
            Please contact the owner to assign members to you. Once members are
            assigned, you'll be able to manage their training programs.
          </div>
          <div className="sm:text-lg text-sm tracking-wider">
            Your Trainer ID: {trainer_id}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoMemberDashboard;
