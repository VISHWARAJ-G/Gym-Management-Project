import React from "react";
import Feature from "../components/Feature";
import Membership from "../components/Membership";
import Overlay from "../components/Overlay";

function LandingPage() {
  return (
    <>
      <Overlay />
      <Feature />
      <Membership dashboard={false} />
    </>
  );
}

export default LandingPage;
