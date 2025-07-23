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
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin-details`,
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
      setTotalMembers(data?.totalMembers);
      setActiveMembers(data?.activeMembers);
      setExpireMembers(data?.expireMembers);
      setRevenue(data?.revenue);
    };
    fetchDetails();
  }, []);
  if (error)
    return <div className="text-2xl font-bebas text-center p-6">{error}</div>;

  const gridBoxDetails = gridBoxes(
    totalMembers,
    activeMembers,
    expireMembers,
    revenue
  );

  return (
    <>
      <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 md:mx-16 mx-2 sm:my-10 mb-7">
        {gridBoxDetails.map((val) => {
          const Logo = val.Logo;
          return (
            <div
              key={val.name}
              className="flex flex-col items-start bg-white lg:rounded-2xl rounded-md lg:p-7 p-4 hover:shadow-[0px_0px_10px_rgb(0,0,0,0.6)] transition-all"
            >
              <div className="flex justify-between font-bold lg:text-xl text-base text-gray-600 items-center w-full">
                <span className="lg:text-xl text-sm">{val.name}</span>
                <Logo dashboard={true} />
              </div>
              <div className="w-full">
                <div
                  className={`font-bold lg:text-4xl sm:text-2xl text-base mt-4 font-bebas ${
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
                  className={`text-gray-400 text-sm w-full flex items-center gap-2 lg:rounded-2xl rounded-md ${
                    val.isExtraBorderRequired
                      ? `  pl-1 m-[.1rem]  ${
                          val.boxName === "active"
                            ? "bg-green-100 w-full text-green-900 tracking-wider font-bebas"
                            : "bg-yellow-100 w-full text-yellow-900 tracking-wider font-bebas"
                        }`
                      : ""
                  }`}
                >
                  {val.isExtraBorderRequired && (
                    <span
                      className={`inline-block w-2 h-2 lg:rounded-2xl rounded-md ${
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
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 md:mx-16 mx-2 text-2xl">
        <div className="bg-white md:p-9 p-2 w-full order-1 sm:order-2">
          <RecentActivity />
        </div>
        <div className="bg-white md:p-9 p-2 flex flex-col w-full order-2 sm:order-1">
          <h1 className="font-bold md:text-lg xs:text-base text-xs">
            Quick Actions
          </h1>
          <ReportsDownload />
        </div>
      </div>
    </>
  );
}

export default AdminOverview;
