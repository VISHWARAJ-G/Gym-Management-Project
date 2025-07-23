import React, { useContext, useEffect, useState } from "react";
import { AdminEditContext, AuthContext } from "../../context/Context";
import EmailLogo from "../../icons/EmailLogo";
import PhoneLogo from "../../icons/PhoneLogo";
import Location from "../../icons/Location";
import EditLogo from "../../icons/EditLogo";
import DelLogo from "../../icons/DelLogo";
import OverlayTrainerBox from "./OverlayTrainerBox";
import OverlayDelTrainer from "./OverlayDelTrainer";

function AdminTrainers() {
  const { adminToken } = useContext(AuthContext);
  const [edit, setEdit] = useState(false);
  const [trainers, setTrainers] = useState({});
  const [delTrainer, setDelTrainer] = useState({});
  const [showDelOverlay, setShowDelOverlay] = useState(false);
  const [error, setError] = useState("");
  const [trainersList, setTrainersList] = useState([]);
  const { success, setSuccess, deleteSuccess, setDeleteSuccess } =
    useContext(AdminEditContext);

  const handleTrainerList = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/trainers-list`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        return;
      }
      setTrainersList(data.trainersData);
    } catch (err) {
      setError("Error " + err);
    }
  };

  useEffect(() => {
    if (success) {
      handleTrainerList();
      setSuccess(false);
    }
  }, [success]);

  useEffect(() => {
    if (deleteSuccess) {
      handleTrainerList();
      setDeleteSuccess(false);
    }
  }, [deleteSuccess]);

  useEffect(() => {
    handleTrainerList();
  }, []);

  if (error)
    return <div className="text-2xl font-bebas text-center p-6">{error}</div>;

  return (
    <>
      <div className="bg-white md:mx-16 mx-2 lg:px-10 ">
        <div className="md:p-6 p-2 font-bold md:text-2xl text-sm">Trainers Management</div>
        <div className="overflow-x-auto">
          <table className="min-w-max text-left md:ml-6 md:mt-4 ml-2 mt-0 text-sm border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th>Trainer ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Details</th>
                <th className="lg:pl-2">Gender</th>
                <th>Age</th>
                <th>Aadhar</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainersList.map((val, index) => {
                const changeDate = new Date(val.dob).toLocaleDateString(
                  "en-US",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                );
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="md:py-3 md:pr-16 py-1 pr-12">
                      <div className="md:text-sm text-xs">{val.trainer_id}</div>
                    </td>
                    <td className="md:py-3 md:pr-10 py-1 pr-6">
                      <div className="font-medium text-gray-800 md:text-sm text-xs">
                        {val.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        DOB: {changeDate}
                      </div>
                    </td>
                    <td className="md:py-3 md:pr-10 py-1 pr-6">
                      <div className="flex items-center gap-1 md:text-sm text-xs">
                        <PhoneLogo /> {val.phone}
                      </div>
                      <div className="flex items-center gap-1 md:text-sm text-xs">
                        <EmailLogo /> {val.email}
                      </div>
                    </td>
                    <td className="md:py-3 md:pr-10 py-1 pr-6">
                      <div className="flex items-center gap-1 md:text-sm text-xs">
                        <Location /> {val.address}
                      </div>
                    </td>
                    <td className="md:py-3 md:pr-10 py-1 pr-6">
                      <div
                        className={`pl-2 py-1 text-center rounded-3xl md:text-sm text-xs ${
                          val.gender === "Male"
                            ? "bg-blue-200 text-blue-900 pr-2 font-bold"
                            : "bg-pink-200 text-pink-900 pr-2 font-bold"
                        }`}
                      >
                        {val.gender}
                      </div>
                    </td>
                    <td className="md:py-3 md:pr-10 py-1 pr-6">
                      <div className="md:text-sm text-xs">{val.age}</div>
                    </td>
                    <td className="md:py-3 md:pr-10 py-1 pr-6">
                      <div className="md:text-sm text-xs">{val.aadhar}</div>
                    </td>
                    <td className="md:py-3 md:pr-10 py-1 pr-6">
                      <div className="flex gap-6">
                        <button
                          onClick={() => {
                            setEdit(true);
                            setTrainers(val);
                          }}
                          className="p-2 bg-blue-100"
                        >
                          <EditLogo />
                        </button>
                        <button
                          onClick={() => {
                            setShowDelOverlay(true);
                            setDelTrainer(val);
                          }}
                          className="p-2 bg-red-100"
                        >
                          <DelLogo />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {edit && (
          <OverlayTrainerBox
            onClose={() => {
              setEdit(false);
            }}
            setSuccess={setSuccess}
            trainers={trainers}
          />
        )}
        {showDelOverlay && (
          <OverlayDelTrainer
            onClose={() => {
              setShowDelOverlay(false);
            }}
            setDeleteSuccess={setDeleteSuccess}
            delTrainer={delTrainer}
          />
        )}
      </div>
    </>
  );
}

export default AdminTrainers;
