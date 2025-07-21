import React, { useContext, useEffect, useState } from "react";
import { AdminContext, AuthContext } from "../../context/Context";
import { toast, ToastContainer } from "react-toastify";

function OverlayChangeTrainer({ setSuccess, trainerList, onClose, userid }) {
  console.log(userid);
  const { adminToken } = useContext(AuthContext);
  const [trainersId, setTrainersId] = useState([]);
  const [trainerName, setTrainerName] = useState([]);
  const [changedTrainer, setChangedTrainer] = useState({ trainer_id: "" });
  useEffect(() => {
    const trainerIDs = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/trainersID-list/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
        return;
      }
      setTrainersId(data.trainerIDs);
    };
    trainerIDs();
  }, []);
  const compare_data = (old, newVal) => {
    const changed = {};
    if (old !== newVal) {
      changed["trainer_id"] = newVal;
    }
    return changed;
  };
  const changeTrainer = async (e) => {
    e.preventDefault();
    const changed = compare_data(trainerList, changedTrainer.trainer_id);
    if (
      !changedTrainer.trainer_id ||
      changedTrainer.trainer_id === trainerList
    ) {
      toast.info("No changes Made");
      return;
    }
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/update-usertrainers/${userid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(changed),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Update Failed");
        return;
      }
      toast.success(
        "User Detail updated successfully! Will close in 5 seconds"
      );
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 5000);
    } catch (error) {
      toast.error("Error" + error);
    }
  };

  return (
    <>
      <ToastContainer autoClose={4000} position="top-right" />
      <div
        className="inset-0 flex justify-center items-center fixed bg-black/80 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white p-10 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="font-bold text-xl mb-5">
            Edit Member's Trainer Detail
          </h1>
          <form onSubmit={changeTrainer}>
            <div>
              <label htmlFor="TrainerID" className="text-gray-600 font-bold">
                Trainer IDs
              </label>
            </div>
            <div className="mt-3">
              <select
                name="trainer_id"
                id="TrainerID"
                value={changedTrainer.trainer_id || trainerList}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setChangedTrainer((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                className="w-full p-2 mb-4 rounded-xl border-gray-500 border-2"
              >
                {trainersId.map((val) => {
                  return (
                    <option key={val.trainer_id} value={val.trainer_id}>
                      {val.trainer_id} - {val.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <button className="bg-gradient-to-r p-2 w-full from-yellow-300 to-orange-300 font-bold">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default OverlayChangeTrainer;
