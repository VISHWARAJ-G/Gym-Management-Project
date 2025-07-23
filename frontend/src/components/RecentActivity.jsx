import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Context";

function RecentActivity() {
  const [error, setError] = useState("");
  const [activities, setActivities] = useState([]);
  const { adminToken } = useContext(AuthContext);
  useEffect(() => {
    const recentFunc = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/recent-activity`,
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
        setActivities(data.activities);
      } catch (errors) {
        alert("Error", errors.message);
      }
    };
    recentFunc();
  }, []);
  if (error) return <div>{error}</div>;
  return (
    <div>
      <h1 className="text-black font-bold mb-4 md:text-lg xs:text-base text-xs">
        Recent Activity
      </h1>
      <div className="grid grid-cols-1 gap-4">
        {activities.map((val) => {
          const changeDate = new Date(val.created_at).toLocaleDateString(
            "en-US",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }
          );
          return (
            <div
              key={val.users.name}
              className="bg-gray-100 grid grid-cols-1 w-full"
            >
              <div className="flex justify-between items-center w-full p-1">
                <div className="md:text-lg  xs:text-base text-xs font-bold">
                  {val.users.name}
                </div>
                <div
                  className={`md:text-lg xs:text-base text-xs font-montserrat ${
                    val.status === "active"
                      ? "bg-green-200 text-green-800 font-bold px-2 py-1 rounded-xl"
                      : val.status === ("expiring" || "expired")
                      ? "bg-yellow-200 text-yellow-800 font-bold px-2 py-1 rounded-xl"
                      : "bg-gray-400 text-gray-900 font-bold px-2 py-1 rounded-xl"
                  }`}
                >
                  {val.status.charAt(0).toUpperCase() + val.status.slice(1)}
                </div>
              </div>
              <div className="flex justify-between items-center p-1">
                <div className="xs:text-sm text-xs text-gray-500">
                  {val.plans.plan_name}
                </div>
                <div className="xs:text-sm text-xs">{changeDate}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentActivity;
