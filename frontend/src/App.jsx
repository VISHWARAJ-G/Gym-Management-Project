import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import LoginUser from "./pages/LoginUser";
import SignupUser from "./pages/SignupUser";
import LoginTrainer from "./pages/LoginTrainer";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./services/ScrollToTop";
import VerifyPage from "./pages/VerifyPage";
import VerifyEmail from "./pages/VerifyEmail";
import { useContext } from "react";
import { SignupContext } from "./context/Context.jsx";
import PrivateUserRoute from "./routes/PrivateUserRoute.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import Payment from "./pages/Payment.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PrivateAdminRoute from "./routes/PrivateAdminRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import PrivateTrainerRoute from "./routes/PrivateTrainerRoute.jsx";
import TrainerDashboard from "./components/TrainerDashboard/TrainerDashboard.jsx";
import PrivatePaymentGatewayRoute from "./routes/PrivatePaymentGatewayRoute.jsx";
import PrivatePaymentCompleted from "./routes/PrivatePaymentCompleted.jsx";

function App() {
  const { signupInfo } = useContext(SignupContext);
  const location = useLocation();
  const showNavbarRoutes = [
    "/",
    "/login-user",
    "/login-trainer",
    "/signup-user",
    "/verify-page",
    "/verify-email",
  ];
  const showNavbar = showNavbarRoutes.includes(location.pathname);
  return (
    <>
      <ScrollToTop />
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/login-user" element={<LoginUser />}></Route>
        <Route path="/signup-user" element={<SignupUser />}></Route>
        <Route path="/login-trainer" element={<LoginTrainer />}></Route>
        <Route
          path="/verify-page"
          element={
            <PrivateUserRoute>
              <VerifyPage emailVal={signupInfo.email} />
            </PrivateUserRoute>
          }
        ></Route>
        <Route path="/verify-email/:token" element={<VerifyEmail />}></Route>
        <Route
          path="/user-dashboard"
          element={
            <PrivateUserRoute>
              <UserDashboard />
            </PrivateUserRoute>
          }
        ></Route>
        <Route
          path="/payment-gateway"
          element={
            <PrivateUserRoute>
              <PrivatePaymentGatewayRoute>
                <Payment />
              </PrivatePaymentGatewayRoute>
            </PrivateUserRoute>
          }
        ></Route>
        <Route
          path="/payment-success"
          element={
            <PrivateUserRoute>
                <PaymentSuccess />
            </PrivateUserRoute>
          }
        ></Route>
        <Route
          path="/admin-dashboard"
          element={
            <PrivateAdminRoute>
              <AdminDashboard />
            </PrivateAdminRoute>
          }
        ></Route>
        <Route
          path="/trainer-dashboard"
          element={
            <PrivateTrainerRoute>
              <TrainerDashboard />
            </PrivateTrainerRoute>
          }
        />
      </Routes>
      {showNavbar && <Footer />}
    </>
  );
}

export default App;
