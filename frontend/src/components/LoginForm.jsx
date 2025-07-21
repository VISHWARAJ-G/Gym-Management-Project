import React, { useContext, useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Arrow from "../icons/Arrow";
import { Link, useNavigate } from "react-router-dom";
import { trainerLoginMethod, userLoginMethod } from "../services/LoginDetails";
import { AuthContext } from "../context/Context";

function LoginForm({ value }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const labelFor = value === "Trainer" ? "Trainer" : "User";
  const innerName = labelFor === "Trainer" ? "Trainer ID" : "Email Address";
  const [loginData, setLoginData] = useState({
    role: value,
    id: "",
    password: "",
  });
  const {
    setIsUserLoggedin,
    setToken,
    setUser,
    setIsAdminLoggedIn,
    setAdmin,
    setAdminToken,
    setIsTrainerLoggedIn,
    setTrainer,
    setTrainerToken,
  } = useContext(AuthContext);
  const [error, setError] = useState(false);

  const handleUserLogin = (e) => {
    userLoginMethod(
      e,
      loginData,
      setIsUserLoggedin,
      navigate,
      setError,
      setMessage,
      setLoading,
      setToken,
      setUser
    );
  };
  const handleTrainerLogin = async (e) => {
    trainerLoginMethod(
      e,
      loginData,
      setError,
      setMessage,
      setLoading,
      setIsAdminLoggedIn,
      navigate,
      setAdmin,
      setAdminToken,
      setIsTrainerLoggedIn,
      setTrainer,
      setTrainerToken
    );
  };
  const messageBox = useRef();
  useEffect(() => {
    if (error) {
      requestAnimationFrame(() => {
        messageBox.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }, [error]);
  return (
    <form
      className="mt-10"
      onSubmit={value === "User" ? handleUserLogin : handleTrainerLogin}
    >
      {error ? (
        <div className="flex justify-center">
          <div
            className="font-bebas tracking-wider text-center text-xl bg-red-700 text-white py-4 px-8 mb-6 animate-pulse rounded-full"
            ref={messageBox}
          >
            {message}
          </div>
        </div>
      ) : (
        loading && (
          <div className="flex justify-center">
            <div
              className="font-bebas tracking-wider text-center text-xl bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 px-8 mb-6 animate-pulse rounded-full"
              ref={messageBox}
            >
              Loading...
            </div>
          </div>
        )
      )}
      <div className="flex flex-col items-start text-xl w-full font-semibold">
        <div className="mb-3 font-bold text-xl">
          <label htmlFor={labelFor}>{innerName}</label>
        </div>
        <input
          type="text"
          name={labelFor}
          value={loginData.id}
          id={labelFor}
          onChange={(e) => setLoginData({ ...loginData, id: e.target.value })}
          placeholder={`Enter your ${innerName}`}
          className="w-full border-2 p-4 text-xl rounded-2xl focus:outline-2 outline-blue-500"
        />
      </div>
      <div className="flex flex-col items-start text-xl w-full font-semibold relative mt-3">
        <div className="mb-3 font-bold text-xl">
          <label htmlFor="Password">Password</label>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          name="Password"
          value={loginData.password}
          id="Password"
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          placeholder="Enter your Password"
          className="w-full border-2 p-4 rounded-2xl text-xl focus:outline-2 outline-blue-500"
        />
        <div
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-[71%] -translate-y-1/2 cursor-pointer text-gray-600"
        >
          {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
        </div>
      </div>
      <div>
        <button className="bg-gradient-to-r from-yellow-500 to-orange-500 group flex gap-2 p-4 mt-7 font-bold w-full justify-center text-xl hover:scale-105 transition-all">
          Login{" "}
          <span className="inline-flex items-center">
            <Arrow />
          </span>
        </button>
      </div>
      {value === "User" ? (
        <div className="p-5 text-center text-xl text-gray-500">
          Don't have an account?{" "}
          <span className="text-blue-900 font-semibold">
            <Link to={"/signup-user"}>Sign up here</Link>
          </span>
        </div>
      ) : (
        <></>
      )}
    </form>
  );
}

export default LoginForm;
