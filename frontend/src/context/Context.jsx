import React, { useEffect, useRef } from "react";
import { createContext, useState } from "react";

export const SignupContext = createContext();

export const SignupProvider = ({ children }) => {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    age: "",
    gender: "",
    dob: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    cpassword: "",
  });
  return (
    <SignupContext.Provider value={{ signupInfo, setSignupInfo }}>
      {children}
    </SignupContext.Provider>
  );
};

export const AuthContext = createContext();

export const AuthProvide = ({ children }) => {
  const [isUserLoggedin, setIsUserLoggedin] = useState(false);
  const [isTrainerLoggedIn, setIsTrainerLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [trainerToken, setTrainerToken] = useState(null);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [reload, setReload] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
    const stored_token = localStorage.getItem("Token");
    const stored_user = localStorage.getItem("User");
    const stored_AdminToken = localStorage.getItem("AdminToken");
    const stored_Admin = localStorage.getItem("Admin");
    const stored_TrainerToken = localStorage.getItem("TrainerToken");
    const stored_Trainer = localStorage.getItem("Trainer");

    if (stored_token && stored_user) {
      setIsUserLoggedin(true);
      setToken(stored_token);
      setUser(JSON.parse(stored_user));
    }

    if (stored_AdminToken && stored_Admin) {
      try {
        setIsAdminLoggedIn(true);
        setAdminToken(stored_AdminToken);
        setAdmin(JSON.parse(stored_Admin));
      } catch (err) {
        console.error("Failed to parse Admin JSON from localStorage", err);
        localStorage.removeItem("Admin");
      }
    }

    if (stored_Trainer && stored_TrainerToken) {
      setIsTrainerLoggedIn(true);
      setTrainerToken(stored_TrainerToken);
      setTrainer(JSON.parse(stored_Trainer));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    if (token || user) {
      localStorage.removeItem("Token");
      localStorage.removeItem("User");
      setIsUserLoggedin(false);
      setToken(null);
      setUser(null);
    } else if (admin || adminToken) {
      localStorage.removeItem("AdminToken");
      localStorage.removeItem("Admin");
      setIsAdminLoggedIn(false);
      setAdminToken(null);
      setAdmin(null);
    } else if (trainer || trainerToken) {
      localStorage.removeItem("Trainer");
      localStorage.removeItem("TrainerToken");
      setIsTrainerLoggedIn(false);
      setTrainer(null);
      setTrainerToken(null);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        isUserLoggedin,
        setIsUserLoggedin,
        logout,
        loading,
        token,
        user,
        setToken,
        setUser,
        selectedPlan,
        setSelectedPlan,
        reload,
        setReload,
        setSignedUp,
        signedUp,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        adminToken,
        setAdminToken,
        admin,
        setAdmin,
        isTrainerLoggedIn,
        setIsTrainerLoggedIn,
        trainerToken,
        setTrainerToken,
        trainer,
        setTrainer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const RefContext = createContext();

export const RefProvide = ({ children }) => {
  const moveRef = useRef(null);
  const moveFunc = () => {
    moveRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <RefContext.Provider value={{ moveRef, moveFunc }}>
      {children}
    </RefContext.Provider>
  );
};

export const DBContext = createContext();

export const DBProvider = ({ children }) => {
  const [dbData, setDbData] = useState({});
  return (
    <DBContext.Provider value={{ dbData, setDbData }}>
      {children}
    </DBContext.Provider>
  );
};

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [totalMembers, setTotalMembers] = useState(NaN);
  const [activeMembers, setActiveMembers] = useState(NaN);
  const [expireMembers, setExpireMembers] = useState(NaN);
  const [revenue, setRevenue] = useState(NaN);
  const [activeLink, setActiveLink] = useState("Overview");

  return (
    <AdminContext.Provider
      value={{
        totalMembers,
        setTotalMembers,
        activeMembers,
        setActiveMembers,
        expireMembers,
        setExpireMembers,
        revenue,
        setRevenue,
        activeLink,
        setActiveLink,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const AdminEditContext = createContext();

export const AdminEditProvider = ({ children }) => {
  const [success, setSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  return (
    <AdminEditContext.Provider
      value={{ success, setSuccess, deleteSuccess, setDeleteSuccess }}
    >
      {children}
    </AdminEditContext.Provider>
  );
};

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [payNowClicked, setPayNowClicked] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  return (
    <PaymentContext.Provider
      value={{ payNowClicked, setPayNowClicked, paymentDone, setPaymentDone }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
