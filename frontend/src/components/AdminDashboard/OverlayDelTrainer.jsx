import React, { useContext, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { AdminContext, AuthContext } from "../../context/Context";

function OverlayDelTrainer({ onClose, setDeleteSuccess, delTrainer }) {
  const { adminToken } = useContext(AuthContext);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/delete-trainer/${
          delTrainer.trainer_id
        }`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setDeleteSuccess(false);
        toast.error("Trainer is assigned with user");
        return;
      }
      toast.success("Trainer Deleted Successfully, Will Close in 5 seconds");
      setDeleteSuccess(true);
      setTimeout(() => {
        onClose();
      }, 5000);
    } catch (err) {
      toast.error("Error" + err);
    }
  };
  return (
    <>
      <ToastContainer autoClose={4000} position="top-right"></ToastContainer>
      <div
        className="bg-black/80 fixed flex justify-center items-center z-50 inset-0"
        onClick={onClose}
      >
        <div
          className="bg-white flex flex-col justify-start gap-5 px-8 py-12 m-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-black font-poppins font-bold text-center sm:text-lg text-sm">
            Delete Confirmation
          </div>
          <div className="text-gray-500 font-poppins sm:text-lg text-xs text-center">
            Are you sure you want to delete Trainer {delTrainer.name}?
          </div>
          <div className="flex justify-center gap-5">
            <div>
              <button
                className="p-3 px-7 bg-gray-300 rounded-3xl sm:text-lg text-xs"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
            <div>
              <button
                className="p-3 px-7 bg-red-800 text-white rounded-3xl sm:text-lg text-xs"
                onClick={handleClick}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OverlayDelTrainer;
