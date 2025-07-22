import React, { useContext, useRef, useState } from "react";
import Arrow from "../icons/Arrow";
import { CPassFunc, handleSubmit, patternFunc } from "../services/SignupInfo";
import { useNavigate } from "react-router-dom";
import { AuthContext, SignupContext } from "../context/Context.jsx";
import validator from "validator";
import disposableDomains from "disposable-email-domains";

function SignupForm() {
  const navigate = useNavigate();

  const { signupInfo, setSignupInfo } = useContext(SignupContext);
  const [signupError, setSignupError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { signedUp, setSignedUp } = useContext(AuthContext);

  const [errors, setErrors] = useState(
    Object.keys(signupInfo).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {})
  );

  const calculateAge = (dobString) => {
    const today = new Date();
    const dob = new Date(dobString);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  };

  const isDisposable = (email) => {
    const domain = email.split("@")[1]?.toLowerCase();
    return disposableDomains.includes(domain);
  };

  const patternCheck = (e) => {
    patternFunc(e, setSignupInfo, setErrors, errors);
  };

  const handleConfirmPasswordChange = (e) => {
    CPassFunc(e, setSignupInfo, setErrors, errors);
  };

  const change = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };
  const phoneChange = (e) => {
    setSignupInfo((prev) => {
      const updated = { ...prev, [e.target.name]: e.target.value };
      setErrors((prev2) => ({ ...prev2, phone: updated.phone.length !== 10 }));
      return updated;
    });
  };
  const fieldRef = Object.keys(signupInfo).reduce((acc, key) => {
    acc[key] = useRef();
    return acc;
  }, {});
  const handleSubmission = (e) => {
    e.preventDefault();
    if (!validator.isEmail(signupInfo.email)) {
      setErrors((prev) => ({ ...prev, email: true }));
      setSignupError(true);
      setErrorMsg("Invalid email format");
      return;
    }
    if (isDisposable(signupInfo.email)) {
      setErrors((prev) => ({ ...prev, email: true }));
      setSignupError(true);
      setErrorMsg("Disposable email addresses are not allowed");
      return;
    }
    handleSubmit(
      e,
      signupInfo,
      setErrors,
      errors,
      fieldRef,
      navigate,
      setSignupError,
      setErrorMsg,
      setLoading,
      setSignedUp
    );
  };
  return (
    <form onSubmit={handleSubmission}>
      <div className="grid xs:grid-cols-2 grid-cols-1 gap-7">
        <div className="flex flex-col md:gap-4 gap-1" ref={fieldRef.name}>
          <label htmlFor="Name" className="md:text-xl text-base font-bold">
            Full Name *
          </label>
          <input
            type="text"
            id="Name"
            name="name"
            value={signupInfo.name}
            onChange={change}
            className={`focus:outline-2 focus:outline-yellow-600 p-1 px-2 md:text-xl text-base lg:min-w-80 ${
              errors.name
                ? "border-4 border-red-600 animate-pulse"
                : "border-2 border-slate-400"
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <div className="-mt-4 ml-2 text-red-600 animate-pulse">
              Data is not given properly
            </div>
          )}
        </div>
        <div className="flex flex-col md:gap-4 gap-1" ref={fieldRef.dob}>
          <label htmlFor="DOB" className="md:text-xl text-base font-bold">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dob"
            value={signupInfo.dob}
            onChange={(e) => {
              const dobVal = e.target.value;
              const ageVal = calculateAge(dobVal);
              setSignupInfo((prev) => ({
                ...prev,
                dob: dobVal,
                age: ageVal,
              }));
              if (errors.dob) {
                setErrors((prev) => ({ ...prev, dob: false }));
              }
            }}
            id="DOB"
            className={`focus:outline-2 focus:outline-yellow-600 p-[.2rem] px-2 md:text-xl text-base lg:min-w-80 ${
              errors.dob
                ? "border-4 border-red-600 animate-pulse"
                : "border-2 border-slate-400"
            }`}
          />
          {errors.dob && (
            <div className="lg:-mt-4 ml-2 text-red-600 animate-pulse">
              Data is not given properly
            </div>
          )}
        </div>

        <div
          className="flex flex-col md:gap-4 gap-1 lg:-mb-5"
          ref={fieldRef.gender}
        >
          <label htmlFor="Gender" className="md:text-xl text-base font-bold">
            Gender *
          </label>
          <select
            id="Gender"
            name="gender"
            onChange={change}
            value={signupInfo.gender}
            className={`focus:outline-2 focus:outline-yellow-600 p-1 px-2 md:text-xl text-base lg:min-w-80 ${
              errors.gender
                ? "border-4 border-red-600 animate-pulse"
                : "border-2 border-slate-400"
            }`}
          >
            <option value="" disabled hidden>
              Select a gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
          {errors.gender && (
            <div className="lg: ml-2 text-red-600 animate-pulse">
              Data is not given properly
            </div>
          )}
        </div>
        <div className="flex flex-col md:gap-4 gap-1">
          <label htmlFor="Age" className="md:text-xl text-base font-bold">
            Age
          </label>
          <input
            type="number"
            id="Age"
            name="age"
            value={signupInfo.age || ""}
            readOnly
            className="p-1 px-2 md:text-xl text-base w-full border-2 border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          <div className="text-xs text-red-800 lg:-mt-3">* Auto Calculated</div>
        </div>
      </div>
      <div
        className="flex flex-col md:gap-4 gap-1 mt-4 lg:mt-1 items-start w-full"
        ref={fieldRef.address}
      >
        <label htmlFor="Address" className="md:text-xl text-base font-bold">
          Address *
        </label>
        <textarea
          name="address"
          value={signupInfo.address}
          onChange={change}
          id="Address"
          placeholder="Enter your Address "
          className={`w-full h-full focus:outline-2 focus:outline-yellow-600 lg:p-5 p-1 px-2 md:text-xl text-base ${
            errors.address
              ? "border-4 border-red-600 animate-pulse"
              : "border-2 border-slate-400"
          }`}
        ></textarea>
        {errors.address && (
          <div className="-mt-4 ml-2 text-red-600 animate-pulse">
            Data is not given properly
          </div>
        )}
      </div>
      <div className="grid xs:grid-cols-2 grid-cols-1 gap-7 mt-6">
        <div className="flex flex-col md:gap-4 gap-1" ref={fieldRef.phone}>
          <label htmlFor="Phone" className="md:text-xl text-base font-bold">
            Phone Number *
          </label>
          <input
            type="number"
            id="Phone"
            name="phone"
            value={signupInfo.phone}
            onChange={phoneChange}
            className={`focus:outline-2 focus:outline-yellow-600 p-1 px-2 md:text-xl text-base ${
              errors.phone
                ? "border-4 border-red-600 animate-pulse"
                : "border-2 border-slate-400"
            }`}
            placeholder="Enter your number"
          />
          {errors.phone && (
            <div className="lg:-mt-4 ml-2 text-red-600 animate-pulse">
              Data is not given properly
            </div>
          )}
        </div>
        <div className="flex flex-col md:gap-4 gap-1" ref={fieldRef.email}>
          <label htmlFor="Email" className="md:text-xl text-base font-bold">
            Email Address *
          </label>
          <input
            type="email"
            id="Email"
            name="email"
            value={signupInfo.email}
            onChange={change}
            className={`focus:outline-2 focus:outline-yellow-600 p-1 px-2 md:text-xl text-base ${
              errors.email
                ? "border-4 border-red-600 animate-pulse"
                : "border-2 border-slate-400"
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <div className="lg:-mt-4 ml-2 text-red-600 animate-pulse">
              Data is not given properly
            </div>
          )}
        </div>
        <div className="flex flex-col md:gap-4 gap-1" ref={fieldRef.password}>
          <label htmlFor="Password" className="md:text-xl text-base font-bold">
            Password *
          </label>
          <input
            type="password"
            id="Password"
            name="password"
            value={signupInfo.password}
            onChange={patternCheck}
            className={`focus:outline-2 focus:outline-yellow-600 p-1 px-2 md:text-xl text-base ${
              errors.password
                ? "border-4 border-red-600 animate-pulse"
                : "border-2 border-slate-400"
            }`}
            placeholder="Create a password"
          />
          {errors.password && (
            <div>
              <h1 className="text-red-600 animate-pulse duration-75">
                Password must have:
              </h1>
              <ul className="text-red-600 animate-pulse duration-75 list-disc ml-5">
                <li>At least 8 characters</li>
                <li>A number</li>
                <li>A special character</li>
              </ul>
            </div>
          )}
        </div>
        <div className="flex flex-col md:gap-4 gap-1" ref={fieldRef.cpassword}>
          <label htmlFor="CPassword" className="md:text-xl text-base font-bold">
            Confirm Password *
          </label>
          <input
            type="password"
            id="CPassword"
            name="cpassword"
            value={signupInfo.cpassword}
            onChange={handleConfirmPasswordChange}
            className={`focus:outline-2 focus:outline-yellow-600 p-1 px-2 md:text-xl text-base lg:min-w-80 ${
              errors.cpassword
                ? "border-4 border-red-600 animate-pulse"
                : "border-2 border-slate-400"
            }`}
            placeholder="Confirm your password"
          />
          {errors.cpassword && (
            <div>
              <h1 className="text-red-600 animate-pulse duration-75">
                Passwords mismatch
              </h1>
            </div>
          )}
        </div>
      </div>
      <div>
        <button
          className={`bg-gradient-to-r from-yellow-500 to-orange-500 group flex gap-2 p-4 mt-7 font-bold w-full justify-center lg:text-2xl text-base hover:scale-105 transition-all rounded-3xl`}
        >
          Create Account{" "}
          <span className="inline-flex items-center">
            <Arrow />
          </span>
        </button>
      </div>
      {loading && (
        <div className="lg:pt-6 pt-3 px-4 text-center font-signika font-bold md:text-xl text-base animate-pulse">
          Loading...
        </div>
      )}
      {signupError && (
        <div className="lg:pt-6 pt-3 px-4 text-center font-signika font-bold md:text-xl text-base text-red-600 animate-pulse">
          {errorMsg || "Signup Error"}
        </div>
      )}
    </form>
  );
}

export default SignupForm;
