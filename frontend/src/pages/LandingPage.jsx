import React, { useContext, useEffect } from "react";
import Feature from "../components/Feature";
import Membership from "../components/Membership";
import Overlay from "../components/Overlay";
import { AuthContext } from "../context/Context";
import { useNavigate } from "react-router-dom";

function LandingPage({ showBurgerMenu, setShowBurgerMenu }) {
  const { isUserLoggedin, isAdminLoggedIn, isTrainerLoggedIn, loading } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isUserLoggedin) navigate("/user-dashboard");
      else if (isTrainerLoggedIn) navigate("/trainer-dashboard");
      else if (isAdminLoggedIn) navigate("/admin-dashboard");
    }
  }, [isUserLoggedin, loading, navigate]);

  if (loading) return null;
  return (
    <div
      className="w-full"
      onClick={() => {
        setShowBurgerMenu(false);
      }}
    >
      <Overlay />
      <Feature />
      <Membership dashboard={false} />
    </div>
  );
}

export default LandingPage;
