import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Context";
import { gridDetail } from "../services/PaidGrid";
import PDFLogo from "../icons/PDFLogo";
import TrainerNameLogo from "../icons/TrainerNameLogo";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function PlanUserSection() {
  const { token } = useContext(AuthContext);
  const decoded = jwtDecode(token);
  const [error, setError] = useState("");
  const [paidUserDetails, setPaidUserDetails] = useState({});
  const [daysLeft, setDaysLeft] = useState("");
  const { id } = decoded;
  useEffect(() => {
    const paidUserFunc = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/paid-dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          setError(data.message);
          return;
        }
        setPaidUserDetails(data.paidUserDetails);
        setDaysLeft(data.days_left);
      } catch (err) {
        setError(err);
      }
    };
    if (token) paidUserFunc();
  }, [token]);
  if (error) return <div>{error}</div>;
  const end_date = new Date(paidUserDetails?.end_date).toLocaleDateString(
    "en-US",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
  const start_date = new Date(paidUserDetails?.start_date).toLocaleDateString(
    "en-US",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  const boxList = gridDetail(paidUserDetails, daysLeft, end_date);

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/download-pdf/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        toast.error("Failed to download PDF: " + errorText);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      link.download = "invoice.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Unable to download invoice. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer autoClose={5000} position="top-right" />
      <div className="pb-1">
        <div className="grid grid-cols-4 gap-4 mx-16 text-xl">
          {boxList.map((val, index) => {
            const Logo = val.logo;
            return (
              <div
                key={index}
                className="flex flex-col bg-white p-5 gap-4 hover:shadow-[0px_0px_10px_rgb(0,0,0,0.5)] rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div className="font-bold">{val.mainName || "N/A"}</div>
                  <div>
                    <Logo />
                  </div>
                </div>
                <div>
                  <div
                    className={`${
                      val.name <= 7 ? "text-red-700" : "text-green-700"
                    } font-bold text-2xl`}
                  >
                    {val.name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-400">
                    {val.stringName || "N/A"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center my-10 mx-20">
          <div className="grid grid-cols-2 gap-12 w-full">
            <div className="bg-white p-8 hover:shadow-[0px_0px_10px_rgb(0,0,0,0.5)]">
              <div className="font-bold text-2xl">Membership Details</div>
              <div className="mt-5 flex flex-col gap-3">
                <div className="flex justify-between">
                  <div>Plan Type:</div>
                  <div className="text-gray-500">
                    {paidUserDetails?.plans?.plan_name || "N/A"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>Started:</div>
                  <div>{start_date || "N/A"}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>Status:</div>
                  <div className="bg-green-200 p-1 px-4 text-green-900 font-bold">
                    {paidUserDetails?.status
                      ? paidUserDetails?.status[0].toUpperCase() +
                        paidUserDetails?.status.slice(1)
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col w-full bg-white p-8 hover:shadow-[0px_0px_10px_rgb(0,0,0,0.5)]">
                <div className="font-bold text-2xl mb-4">Quick Actions</div>
                <div className="flex flex-col gap-5">
                  <a
                    className="border-2 border-gray-200 p-2 flex items-center gap-3 hover:bg-green-700 hover:text-white transition-all"
                    href={`tel:${paidUserDetails?.trainer?.phone}`}
                  >
                    <TrainerNameLogo /> Contact Trainer
                  </a>
                  <button
                    className="border-2 border-gray-200 p-2 flex items-center gap-3 hover:bg-green-700 hover:text-white transition-all"
                    onClick={handleDownloadInvoice}
                  >
                    <PDFLogo /> Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlanUserSection;
