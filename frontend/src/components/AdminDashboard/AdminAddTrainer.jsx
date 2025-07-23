import React, { useContext, useRef, useState } from "react";
import AddMemberLogo from "../../icons/AddMemberLogo";
import { AuthContext } from "../../context/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  handleSubmitFunc,
  Signupdetails,
} from "../../services/AdminAddTrainerTools";

function AdminAddTrainer() {
  const { adminToken } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainerForm, setTrainerForm] = useState(Signupdetails);
  const [error, setError] = useState(
    Object.keys(trainerForm).reduce((acc, val) => {
      acc[val] = false;
      return acc;
    }, {})
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainerForm((prev) => ({ ...prev, [name]: value }));
    if (error[name]) {
      setError((prev) => ({ ...prev, [name]: false }));
    }
  };
  const phoneChange = (e) => {
    setTrainerForm((prev) => {
      const updated = { ...prev, [e.target.name]: e.target.value };
      setError((prev2) => ({ ...prev2, phone: updated.phone.length !== 10 }));
      return updated;
    });
  };

  const handleAadharChange = (e) => {
    setTrainerForm((prev) => {
      const updated = { ...prev, [e.target.name]: e.target.value };
      setError((prev2) => ({ ...prev2, aadhar: updated.aadhar.length !== 12 }));
      return updated;
    });
  };

  const fieldRef = Object.keys(trainerForm).reduce((acc, key) => {
    acc[key] = useRef();
    return acc;
  }, {});

  const handleSubmit = (e) => {
    handleSubmitFunc(
      e,
      setIsSubmitting,
      adminToken,
      trainerForm,
      setTrainerForm,
      toast
    );
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="lg:flex lg:justify-center lg:my-10 mt-2 sm:mx-20 mx-2">
        <div className="bg-white p-5 flex flex-col">
          <div className="flex gap-1 font-bold sm:text-xl text-sm items-center">
            <AddMemberLogo /> Add New Trainer
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-4 text-lg">
              <div className="flex lg:flex-row flex-col lg:gap-20 gap-5 mb-2 sm:p-3 p-1">
                <div className="flex flex-col gap-2" ref={fieldRef.name}>
                  <label
                    htmlFor="Name"
                    className="font-bold text-sm sm:text-lg"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={trainerForm.name}
                    onChange={handleChange}
                    id="Name"
                    placeholder="Enter the name"
                    className={`sm:p-3 p-1 border-2 border-gray-300 sm:text-xl text-sm sm:rounded-xl ${
                      error.name
                        ? "border-4 border-red-600 animate-pulse focus:outline-none"
                        : "focus:outline-2 focus:outline-yellow-600"
                    }`}
                  />
                  {error.name && (
                    <div className="-mt-2 ml-2 text-red-600 animate-pulse">
                      Data is not given properly
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2" ref={fieldRef.email}>
                  <label
                    htmlFor="Email"
                    className="font-bold text-sm sm:text-lg"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={trainerForm.email}
                    onChange={handleChange}
                    id="Email"
                    placeholder="Enter the Email"
                    className={`sm:p-3 p-1 border-2 border-gray-300 sm:text-xl text-sm sm:rounded-xl ${
                      error.email
                        ? "border-4 border-red-600 animate-pulse focus:outline-none"
                        : "focus:outline-2 focus:outline-yellow-600"
                    }`}
                  />
                  {error.email && (
                    <div className="-mt-2 ml-2 text-red-600 animate-pulse">
                      Data is not given properly
                    </div>
                  )}
                </div>
              </div>
              <div
                className="flex lg:flex-row flex-col lg:gap-20 gap-5 mb-2 sm:p-3 p-1 sm:mt-5"
                ref={fieldRef.age}
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="Age" className="font-bold text-sm sm:text-lg">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={trainerForm.age}
                    onChange={handleChange}
                    id="Age"
                    placeholder="Enter the Age"
                    className={`sm:p-3 p-1 border-2 border-gray-300 sm:text-xl text-sm sm:rounded-xl ${
                      error.age
                        ? "border-4 border-red-600 animate-pulse focus:outline-none"
                        : "focus:outline-2 focus:outline-yellow-600"
                    }`}
                  />
                  {error.age && (
                    <div className="-mt-2 ml-2 text-red-600 animate-pulse">
                      Data is not given properly
                    </div>
                  )}
                </div>
                <div
                  className="flex flex-col gap-2 w-full"
                  ref={fieldRef.gender}
                >
                  <label
                    htmlFor="Gender"
                    className="font-bold text-sm sm:text-lg "
                  >
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={trainerForm.gender}
                    onChange={handleChange}
                    id="Gender"
                    className={`sm:p-3 p-1 border-2 border-gray-300 sm:text-xl text-sm sm:rounded-xl ${
                      error.gender
                        ? "border-4 border-red-600 animate-pulse focus:outline-none"
                        : "focus:outline-2 focus:outline-yellow-600"
                    }`}
                  >
                    <option value="" disabled hidden>
                      Select gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                  {error.gender && (
                    <div className="-mt-2 ml-2 text-red-600 animate-pulse">
                      Data is not given properly
                    </div>
                  )}
                </div>
              </div>
              <div
                className="flex lg:flex-row flex-col lg:gap-20 gap-5 mb-2 sm:p-3 p-1 mt-5"
                ref={fieldRef.phone}
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="Phone"
                    className="font-bold text-sm sm:text-lg"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="number"
                    id="Phone"
                    name="phone"
                    value={trainerForm.phone}
                    onChange={phoneChange}
                    className={`sm:p-3 p-1 border-2 border-gray-300 sm:text-xl text-sm sm:rounded-xl ${
                      error.phone
                        ? "border-4 border-red-600 animate-pulse focus:outline-none"
                        : "focus:outline-2 focus:outline-yellow-600"
                    }`}
                    placeholder="Enter your number"
                  />
                  {error.phone && (
                    <div className="-mt-2 ml-2 text-red-600 animate-pulse">
                      Data is not given properly
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full" ref={fieldRef.dob}>
                  <label htmlFor="DOB" className="font-bold text-sm sm:text-lg">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={trainerForm.dob}
                    onChange={handleChange}
                    id="DOB"
                    className={`sm:p-3 p-1 border-2 border-gray-300 sm:text-xl text-sm sm:rounded-xl ${
                      error.dob
                        ? "border-4 border-red-600 animate-pulse focus:outline-none"
                        : "focus:outline-2 focus:outline-yellow-600"
                    }`}
                  />
                  {error.dob && (
                    <div className="-mt-2 ml-2 text-red-600 animate-pulse">
                      Data is not given properly
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-4 gap-2" ref={fieldRef.address}>
                <label
                  htmlFor="Address"
                  className="font-bold text-sm sm:text-lg"
                >
                  Address *
                </label>
                <textarea
                  name="address"
                  value={trainerForm.address}
                  id="Address"
                  onChange={handleChange}
                  placeholder="Enter your Address"
                  className={`sm:p-3 p-1 border-2 border-gray-300 sm:text-xl text-sm sm:rounded-xl ${
                    error.address
                      ? "border-4 border-red-600 animate-pulse focus:outline-none"
                      : "focus:outline-2 focus:outline-yellow-600"
                  }`}
                ></textarea>
                {error.address && (
                  <div className="-mt-2 ml-2 text-red-600 animate-pulse">
                    Data is not given properly
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2" ref={fieldRef.aadhar}>
                <label
                  htmlFor="Aadhar"
                  className="font-bold text-sm sm:text-lg"
                >
                  Aadhar Number *
                </label>
                <input
                  type="number"
                  name="aadhar"
                  value={trainerForm.aadhar}
                  onChange={handleAadharChange}
                  id="Aadhar"
                  placeholder="XXXX-XXXX-XXXX"
                  className={`sm:p-3 p-1 border-2 border-gray-300 sm:text-xl text-sm sm:rounded-xl ${
                    error.aadhar
                      ? "border-4 border-red-600 animate-pulse focus:outline-none"
                      : "focus:outline-2 focus:outline-yellow-600"
                  }`}
                />
                {error.aadhar && (
                  <div className="-mt-2 ml-2 text-red-600 animate-pulse">
                    Data is not given properly
                  </div>
                )}
              </div>
            </div>
            <div>
              <button
                disabled={isSubmitting}
                className="w-full font-bold text-sm sm:text-lg text-white text-center bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-2xl mt-4"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminAddTrainer;
