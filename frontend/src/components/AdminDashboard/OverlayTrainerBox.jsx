import React, { useContext, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { AdminEditContext, AuthContext } from "../../context/Context";

function OverlayTrainerBox({ onClose, trainers, setSuccess }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const [error, setError] = useState(
    Object.keys(trainers).reduce((acc, val) => {
      acc[val] = false;
      return acc;
    }, {})
  );

  const [trainersList, setTrainersList] = useState(trainers);
  const { adminToken } = useContext(AuthContext);
  const trainer_id = trainers?.trainer_id;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainersList((prev) => ({ ...prev, [name]: value }));
    if (error[name]) {
      setError((prev) => ({ ...prev, [name]: false }));
    }
  };
  const compare_data = (trainers, trainersList) => {
    const changed = {};
    for (const key in trainers) {
      if (trainersList[key] !== trainers[key]) {
        changed[key] = trainersList[key];
      }
    }
    return changed;
  };
  const phoneChange = (e) => {
    setTrainersList((prev) => {
      const updated = { ...prev, [e.target.name]: e.target.value };
      setError((prev2) => ({ ...prev2, phone: updated.phone.length !== 10 }));
      return updated;
    });
  };
  const hasEmptyField = Object.entries(trainersList).some(
    ([key, val]) => !val || val.toString().trim() === ""
  );
  const handleUserEditSubmit = async (e) => {
    e.preventDefault();
    if (!hasEmptyField) {
      const changed_data = compare_data(trainers, trainersList);
      if (Object.keys(changed_data).length === 0) {
        toast.info("No changes Made");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5000/api/update-trainers/${trainer_id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify(changed_data),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          toast.error(data.message || "Update Failed");
          return;
        }
        toast.success("Trainer Deleted Successfully, Will Close in 5 seconds");
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 5000);
      } catch (error) {
        toast.error("Error" + error);
      }
    } else {
      const emptyFields = Object.entries(trainersList)
        .filter(([key, value]) => !value || value.toString().trim() === "")
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
  const fieldRef = Object.keys(trainers).reduce((acc, key) => {
    acc[key] = useRef();
    return acc;
  }, {});

  return (
    <>
      <ToastContainer autoClose={4000} position="top-right" />
      <div
        className="bg-black/80 fixed inset-0 z-50 flex justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white flex flex-col p-5 items-start gap-3 min-w-96 m-4 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between w-full items-center">
            <div className="font-bold text-2xl">Edit Member Detail</div>
            <button
              onClick={onClose}
              className="text-black hover:bg-gray-400 hover:text-white px-1"
            >
              X
            </button>
          </div>
          <form onSubmit={handleUserEditSubmit}>
            <div className="flex flex-col gap-1 w-full" ref={fieldRef.name}>
              <label htmlFor="Name" className="text-gray-500 font-bold">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="Name"
                value={trainersList.name}
                onChange={handleChange}
                className={`p-2 border-2 border-gray-400 rounded-xl ${
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
              <label htmlFor="Email" className="text-gray-500 font-bold">
                Email
              </label>
              <input
                type="text"
                name="email"
                id="Email"
                value={trainersList.email}
                onChange={handleChange}
                className={`p-2 border-2 border-gray-400 rounded-xl ${
                  error.email
                    ? "border-4 border-red-600 animate-pulse focus:outline-none"
                    : "focus:outline-2 focus:outline-yellow-600"
                }`}
              />
              {error.email && (
                <div className="-mt-1 text-red-600 animate-pulse">
                  Data is not given properly
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full" ref={fieldRef.phone}>
              <label htmlFor="Phone" className="text-gray-500 font-bold">
                Phone
              </label>
              <input
                type="number"
                name="phone"
                id="Phone"
                value={trainersList.phone}
                onChange={phoneChange}
                className={`p-2 border-2 border-gray-400 rounded-xl ${
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
              <label htmlFor="Dob" className="text-gray-500 font-bold">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                id="Dob"
                value={trainersList.dob}
                onChange={handleChange}
                className={`p-2 border-2 border-gray-400 rounded-xl ${
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
                <label htmlFor="Age" className="text-gray-500 font-bold">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  id="Age"
                  value={trainersList.age}
                  onChange={handleChange}
                  className={`p-2 border-2 border-gray-400 rounded-xl ${
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
                <label htmlFor="Gender">Gender</label>
                <select
                  name="gender"
                  id="Gender"
                  value={trainersList.gender}
                  onChange={handleChange}
                  className={`p-2 border-2 border-gray-400 rounded-xl ${
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
              <label htmlFor="Address" className="">
                Address
              </label>
              <textarea
                name="address"
                id="Address"
                value={trainersList.address}
                onChange={handleChange}
                className={`p-2 border-2 border-gray-400 rounded-xl ${
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
            <button className="p-2 w-full mt-3 font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-400">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default OverlayTrainerBox;
