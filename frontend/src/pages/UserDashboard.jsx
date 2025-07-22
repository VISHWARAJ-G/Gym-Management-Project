import React, { useContext, useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import QuoteBox from "../components/QuoteBox";
import Welcome from "../components/Welcome";
import { AuthContext } from "../context/Context";
import { jwtDecode } from "jwt-decode";
import PlanUserSection from "../components/PlanUserSection";
import NoPlanUserSection from "../components/NoPlanUserSection";
import UserDashboardNavbar from "../components/UserDashboardNavbar";
import UserEditOverlayBox from "../components/UserEditOverlayBox";

function UserDashboard() {
  const { token, reload } = useContext(AuthContext);
  const decoded_token = jwtDecode(token);
  const { payment_status } = decoded_token;

  const [isDropDown, setIsDropDown] = useState(false);
  const [overlay, setOverlay] = useState(false);

  const [showBurgerMenu, setShowBurgerMenu] = useState(false);

  return (
    <>
      <div className="" onClick={() => setIsDropDown(false)}>
        <UserDashboardNavbar
          isDropDown={isDropDown}
          setIsDropDown={setIsDropDown}
          overlay={overlay}
          setOverlay={setOverlay}
          setShowBurgerMenu={setShowBurgerMenu}
          showBurgerMenu={showBurgerMenu}
        />
        <QuoteBox />
        <div className="bg-gray-100">
          <Welcome
            showBurgerMenu={showBurgerMenu}
            setShowBurgerMenu={setShowBurgerMenu}
          />
          {payment_status === "inactive" ? (
            <NoPlanUserSection />
          ) : (
            <PlanUserSection
              showBurgerMenu={showBurgerMenu}
              setShowBurgerMenu={setShowBurgerMenu}
            />
          )}
        </div>
      </div>
      {overlay && (
        <UserEditOverlayBox
          usersDetails={decoded_token}
          onClose={() => setOverlay(false)}
        />
      )}
    </>
  );
}

export default UserDashboard;
