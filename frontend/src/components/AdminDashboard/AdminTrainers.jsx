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
      const response = await fetch("http://localhost:5000/api/trainers-list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
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
      <div className="bg-white mx-16 px-10">
        <div className="p-6 font-bold text-2xl">Trainers Management</div>
        <div className="overflow-x-auto">
          <table className="min-w-max text-left ml-6 mt-4 text-sm">
            <thead>
              <tr>
                <th>Trainer ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Details</th>
                <th className="pl-2">Gender</th>
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
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 pr-16">
                      <div>{val.trainer_id}</div>
                    </td>
                    <td className="py-3 pr-10">
                      <div className="font-medium text-gray-800">
                        {val.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        DOB: {changeDate}
                      </div>
                    </td>
                    <td className="py-3 pr-10">
                      <div className="flex items-center gap-1">
                        <PhoneLogo /> {val.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <EmailLogo /> {val.email}
                      </div>
                    </td>
                    <td className="py-3 pr-10">
                      <div className="flex items-center gap-1">
                        <Location /> {val.address}
                      </div>
                    </td>
                    <td className="py-3 pr-10">
                      <div
                        className={`pl-2 py-1 text-center rounded-3xl ${
                          val.gender === "Male"
                            ? "bg-blue-200 text-blue-900 pr-2 font-bold"
                            : "bg-pink-200 text-pink-900 pr-2 font-bold"
                        }`}
                      >
                        {val.gender}
                      </div>
                    </td>
                    <td className="py-3 pr-10">
                      <div>{val.age}</div>
                    </td>
                    <td className="py-3 pr-10">
                      <div>{val.aadhar}</div>
                    </td>
                    <td className="py-3 pr-10">
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
