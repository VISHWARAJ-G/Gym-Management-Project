import React, { useContext, useEffect, useState } from "react";
import { AdminContext, AuthContext } from "../../context/Context";
import { gridBoxes } from "../../services/AdminLiveData";
import ReportsDownload from "./ReportsDownload";
import RecentActivity from "../RecentActivity";

function AdminOverview() {
  const { adminToken } = useContext(AuthContext);
  const [error, setError] = useState("");
  const {
    setActiveMembers,
    setExpireMembers,
    setRevenue,
    setTotalMembers,
    totalMembers,
    activeMembers,
    expireMembers,
    revenue,
  } = useContext(AdminContext);

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await fetch("http://localhost:5000/api/admin-details", {
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
      setTotalMembers(data?.totalMembers);
      setActiveMembers(data?.activeMembers);
      setExpireMembers(data?.expireMembers);
      setRevenue(data?.revenue);
    };
    fetchDetails();
  }, []);
  if (error) return <div className="text-2xl font-bebas text-center p-6">{error}</div>;

  const gridBoxDetails = gridBoxes(
    totalMembers,
    activeMembers,
    expireMembers,
    revenue
  );

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mx-16 my-10">
        {gridBoxDetails.map((val) => {
          const Logo = val.Logo;
          return (
            <div
              key={val.name}
              className="flex flex-col items-start bg-white rounded-2xl p-7 hover:shadow-[0px_0px_10px_rgb(0,0,0,0.6)] transition-all"
            >
              <div className="flex justify-between font-bold text-gray-600 items-center w-full">
                {val.name}
                <Logo dashboard={true} />
              </div>
              <div className="w-full">
                <div
                  className={`font-bold text-4xl mt-4 font-bebas ${
                    val.isExtraColorRequired
                      ? val.boxName === "active"
                        ? "text-green-600 "
                        : "text-yellow-700"
                      : val.isRupeeRequired
                      ? "text-violet-900"
                      : ""
                  }`}
                >
                  {val.isRupeeRequired ? "\u20B9" : ""}
                  {typeof val.func !== "number" || Number.isNaN(val.func)
                    ? "N/A"
                    : val.func}
                </div>
                <div
                  className={`text-gray-400 text-sm w-full flex items-center gap-2 rounded-full ${
                    val.isExtraBorderRequired
                      ? val.boxName === "active"
                        ? "bg-green-100 w-full text-green-900 tracking-wider font-bebas"
                        : "bg-yellow-100 w-full text-yellow-900 tracking-wider font-bebas"
                      : ""
                  }`}
                >
                  {val.isExtraBorderRequired && (
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        val.boxName === "active"
                          ? "bg-green-800"
                          : "bg-yellow-800"
                      }`}
                    ></span>
                  )}
                  {val.others}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-4 mx-16 text-2xl">
        <div className="bg-white p-9 flex flex-col w-full">
          <h1 className="font-bold">Quick Actions</h1>
          <ReportsDownload />
        </div>
        <div className="bg-white p-9 w-full">
          <RecentActivity />
        </div>
      </div>
    </>
  );
}

export default AdminOverview;
