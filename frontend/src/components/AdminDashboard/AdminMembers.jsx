import React, { useContext, useEffect, useState } from "react";
import { AdminEditContext, AuthContext } from "../../context/Context";
import "react-toastify/dist/ReactToastify.css";
import OverlayChangeTrainer from "./OverlayChangeTrainer";

function AdminMembers() {
  const [showEdit, setShowEdit] = useState(false);
  const { adminToken } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [trainerList, setTrainerList] = useState([]);
  const [showChangeTrainer, setShowChangeTrainer] = useState(false);
  const [usersDetails, setUsersDetails] = useState({});
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const { success, setSuccess } = useContext(AdminEditContext);
  const [userid, setUserid] = useState("");

  const handleUsersList = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users-list`,
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
      setUsers(data.userTrainer);
      console.log("data.userTrainer:", data.userTrainer);
    } catch (errors) {
      setError("Error " + errors);
    }
  };

  useEffect(() => {
    if (success) {
      handleUsersList();
      setSuccess(false);
    }
  }, [success]);

  useEffect(() => {
    handleUsersList();
  }, []);

  if (error)
    return <div className="text-2xl font-bebas text-center p-6">{error}</div>;
  const filteredUsers = users
    ? users.filter((val) => {
        const statusok =
          selectedStatus === "ALL" ||
          val.payment_status.toLowerCase() === selectedStatus.toLowerCase();

        const searchOk =
          val.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          val.phone.includes(searchTerm);

        return statusok && searchOk;
      })
    : [];
  return (
    <>
      <div className="flex justify-between items-center md:m-5 mb-3">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 sm:rounded-xl md:mx-16 mx-2"
        >
          <option value="ALL">All</option>
          <option value="active">Active</option>
          <option value="expiring">Expiring</option>
          <option value="expired">Expired</option>
          <option value="inactive">Inactive</option>
        </select>
        <input
          type="text"
          name="searchbar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 sm:px-5 md:mr-20 mr-2 sm:rounded-2xl text-sm border border-slate-500"
          placeholder="Search for name or phone"
        />
      </div>
      {filteredUsers.length === 0 ? (
        <div className="text-center text-gray-500 font-semibold mt-10">
          No Users Found
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 md:mx-16 mx-2">
          {filteredUsers.map((val) => {
            const changeDate = new Date(val.dob).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
            console.log(val);
            return (
              <div
                key={val.name}
                className="bg-white flex flex-col gap-3 w-full mx:p-6 p-3 lg:text-base sm:text-sm text-xs"
              >
                <div className="flex justify-between items-center">
                  <div className="font-bold md:text-lg xs:text-base text-xs">
                    {val.name}
                  </div>
                  <div
                    className={`font-monoserrat font-bold px-2 py-1 ${
                      val.payment_status === "active"
                        ? "bg-green-300 text-green-800"
                        : val.status === "expiring"
                        ? "bg-yellow-300 text-yellow-800"
                        : "bg-red-300 text-red-800"
                    }  md:text-lg xs:text-base text-xs`}
                  >
                    {val.payment_status[0].toUpperCase() +
                      val.payment_status.slice(1)}
                  </div>
                </div>
                <div className="font-mono text-gray-700 flex justify-between">
                  <span className="text-black">Phone: </span>
                  {val.phone}
                </div>
                <div className="font-mono text-gray-700 max-w-full flex items-center overflow-hidden justify-between">
                  <span className="text-black">Email: </span>
                  <span
                    title={val.email}
                    className=" truncate max-w-sm cursor-pointer"
                  >
                    {val.email}
                  </span>
                </div>
                <div className="font-mono text-gray-700 max-w-full flex items-center overflow-hidden justify-between">
                  <span className="text-black">Date of Birth: </span>
                  <span
                    title={changeDate}
                    className=" truncate max-w-sm cursor-pointer"
                  >
                    {changeDate}
                  </span>
                </div>
                <div className="font-mono text-gray-700 flex justify-between">
                  <span className="text-black">Gender: </span>
                  {val.gender}
                </div>
                <div className="font-mono text-gray-700 flex justify-between">
                  <span className="text-black">Trainer Name:</span>
                  {`${val.trainer_id} : ${val.trainer_name}`}
                </div>
                <div className="flex justify-center items-center gap-10">
                  {/* <div>
                    <button
                      onClick={() => {
                        setUsersDetails(val);
                        console.log(val);
                        setShowEdit(true);
                      }}
                      className="border-2 border-slate-400 hover:bg-blue-900 hover:text-white transition-all hover:border-none px-16 py-2 font-semibold rounded-xl"
                    >
                      Edit
                    </button>
                  </div> */}
                  <div>
                    <button
                      disabled={val.payment_status === "inactive"}
                      onClick={() => {
                        setTrainerList(val.trainer_id);
                        setShowChangeTrainer(true);
                        setUserid(val.user_id);
                      }}
                      className={`py-2 font-semibold px-8  transition-all rounded-xl ${
                        val.payment_status === "inactive"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "hover:bg-yellow-600 hover:text-white hover:border-none border-2 border-slate-400"
                      }
                    `}
                    >
                      Change Trainer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* {showEdit && (
        <OverlayBox
          setSuccess={setSuccess}
          usersDetails={usersDetails}
          onClose={() => {
            setShowEdit(false);
          }}
        />
      )} */}
      {showChangeTrainer && (
        <OverlayChangeTrainer
          setSuccess={setSuccess}
          onClose={() => {
            setShowChangeTrainer(false);
          }}
          trainerList={trainerList}
          userid={userid}
        />
      )}
    </>
  );
}

export default AdminMembers;
