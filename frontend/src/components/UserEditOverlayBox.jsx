import React, { useContext, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function UserEditOverlayBox({ usersDetails, onClose }) {
  const { setToken, setUser } = useContext(AuthContext);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const [error, setError] = useState(
    Object.keys(usersDetails).reduce((acc, val) => {
      acc[val] = false;
      return acc;
    }, {})
  );
  const [users, setUsers] = useState(usersDetails);
  const { token } = useContext(AuthContext);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers((prev) => ({ ...prev, [name]: value }));
    if (error[name]) {
      setError((prev) => ({ ...prev, [name]: false }));
    }
  };
  const compare_data = (usersDetails, users) => {
    const changed = {};
    for (const key in users) {
      if (usersDetails[key] !== users[key]) {
        changed[key] = users[key];
      }
    }
    return changed;
  };
  const phoneChange = (e) => {
    setUsers((prev) => {
      const updated = { ...prev, [e.target.name]: e.target.value };
      setError((prev2) => ({ ...prev2, phone: updated.phone.length !== 10 }));
      return updated;
    });
  };
  const fieldRef = Object.keys(usersDetails).reduce((acc, key) => {
    acc[key] = useRef();
    return acc;
  }, {});
  const handleUserEditSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(users).every(Boolean)) {
      const changed_data = compare_data(usersDetails, users);
      if (Object.keys(changed_data).length === 0) {
        toast.info("No changes Made");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5000/api/update-users/${usersDetails.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(changed_data),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          toast.error(data.message || "Update Failed");
          return;
        }
        localStorage.setItem("Token", data.token);
        localStorage.setItem("User", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success(
          "User Detail updated successfully! Will close in 5 seconds"
        );
        setTimeout(() => {
          onClose();
        }, 5000);
      } catch (error) {
        toast.error("Error" + error);
      }
    } else {
      const emptyFields = Object.entries(users)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

      const newError = {};
      emptyFields.forEach((field) => {
        newError[field] = true;
      });

      setError(newError);
      const firstErrorField = emptyFields[0];
      if (firstErrorField && fieldRef[firstErrorField]?.current) {
        fieldRef[firstErrorField].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };
  return (
    <>
      <ToastContainer autoClose={4000} position="top-right" />
      <div
        className="bg-black/80 fixed inset-0 z-50 flex justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white flex flex-col md:p-5 p-2 my-3 mx-[.1rem] items-start gap-3 md:m-4 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between w-full items-center">
            <div className="font-bold md:text-2xl text-base">
              Edit Member Detail
            </div>
            <button
              onClick={onClose}
              className="text-black hover:bg-gray-400 hover:text-white px-1"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <form onSubmit={handleUserEditSubmit}>
            <div className="flex flex-col gap-1 w-full" ref={fieldRef.name}>
              <label htmlFor="Name" className="text-gray-500 font-bold text-sm">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="Name"
                value={users.name}
                onChange={handleChange}
                className={`p-2 border-2 border-gray-400 text-sm ${
                  error.name
                    ? "border-4 border-red-600 animate-pulse focus:outline-none"
                    : "focus:outline-2 focus:outline-yellow-600"
                }`}
              />
              {error.name && (
                <div className="-mt-1 text-red-600 animate-pulse">
                  Data is not given properly
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full" ref={fieldRef.email}>
              <label
                htmlFor="Email"
                className="text-gray-500 font-bold text-sm"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                id="Email"
                readOnly
                value={users.email}
                className={`p-2 border-2 border-gray-50 focus:outline-none text-sm bg-gray-100`}
              />
              {error.email && (
                <div className="-mt-1 text-red-600 animate-pulse">
                  Data is not given properly
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full" ref={fieldRef.phone}>
              <label
                htmlFor="Phone"
                className="text-gray-500 font-bold text-sm"
              >
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="Phone"
                value={users.phone}
                onChange={phoneChange}
                className={`p-2 border-2 border-gray-400 text-sm ${
                  error.phone
                    ? "border-4 border-red-600 animate-pulse focus:outline-none"
                    : "focus:outline-2 focus:outline-yellow-600"
                }`}
              />
              {error.phone && (
                <div className="-mt-1 text-red-600 animate-pulse">
                  Data is not given properly
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full" ref={fieldRef.dob}>
              <label htmlFor="Dob" className="text-gray-500 font-bold text-sm">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                id="Dob"
                value={users.dob}
                onChange={handleChange}
                className={`p-2 border-2 border-gray-400 text-sm ${
                  error.dob
                    ? "border-4 border-red-600 animate-pulse focus:outline-none"
                    : "focus:outline-2 focus:outline-yellow-600"
                }`}
              />
              {error.dob && (
                <div className="-mt-1 text-red-600 animate-pulse">
                  Data is not given properly
                </div>
              )}
            </div>
            <div className="flex justify-between gap-3" ref={fieldRef.age}>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor="Age"
                  className="text-gray-500 font-bold text-sm"
                >
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  id="Age"
                  value={users.age}
                  onChange={handleChange}
                  className={`p-2 border-2 border-gray-400 text-sm ${
                    error.age
                      ? "border-4 border-red-600 animate-pulse focus:outline-none"
                      : "focus:outline-2 focus:outline-yellow-600"
                  }`}
                />
                {error.age && (
                  <div className="-mt-1 text-red-600 animate-pulse">
                    Data is not given properly
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full" ref={fieldRef.gender}>
                <label
                  htmlFor="Gender"
                  className="text-gray-500 font-bold text-sm"
                >
                  Gender
                </label>
                <select
                  name="gender"
                  id="Gender"
                  value={users.gender}
                  onChange={handleChange}
                  className={`p-2 border-2 border-gray-400 text-sm ${
                    error.gender
                      ? "border-4 border-red-600 animate-pulse focus:outline-none"
                      : "focus:outline-2 focus:outline-yellow-600"
                  }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
                {error.gender && (
                  <div className="-mt-1 text-red-600 animate-pulse">
                    Data is not given properly
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full" ref={fieldRef.address}>
              <label
                htmlFor="Address"
                className="text-gray-500 font-bold text-sm"
              >
                Address
              </label>
              <textarea
                name="address"
                id="Address"
                value={users.address}
                onChange={handleChange}
                className={`p-2 border-2 border-gray-400 text-sm ${
                  error.address
                    ? "border-4 border-red-600 animate-pulse focus:outline-none"
                    : "focus:outline-2 focus:outline-yellow-600"
                }`}
              ></textarea>
              {error.address && (
                <div className="-mt-1 text-red-600 animate-pulse">
                  Data is not given properly
                </div>
              )}
            </div>
            <button className="p-2 w-full mt-3 font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-400 text-sm">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserEditOverlayBox;
