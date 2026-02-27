import React, { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiFilter,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import {
  getWithdrawalQueue,
  processWithdrawal,
} from "../../savings/services/withdrawalApi";
import toast from "react-hot-toast";
import { useConfirm } from "../../../contexts/ConfirmationContext";

const WithdrawalQueue = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const confirm = useConfirm();

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const data = await getWithdrawalQueue();
      setWithdrawals(data.requests);
    } catch (error) {
      toast.error("Failed to load withdrawal queue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (id, status) => {
    let rejectionReason = "";

    if (status === "rejected") {
      rejectionReason = prompt("Please enter a reason for rejection:");
      if (!rejectionReason) return;
    }

    const confirmed = await confirm({
      title: `${status === "approved" ? "Approve" : "Reject"} Withdrawal`,
      message: `Are you sure you want to ${status} this withdrawal request?`,
      confirmText: status === "approved" ? "Approve" : "Reject",
      type: status === "approved" ? "success" : "danger",
    });

    if (!confirmed) return;

    try {
      await processWithdrawal(id, status, rejectionReason);
      toast.success(`Withdrawal ${status} successfully`);
      fetchQueue();
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Failed to ${status} request`,
      );
    }
  };

  const filteredWithdrawals = withdrawals.filter(
    (w) =>
      w.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.account?.accountNumber.includes(searchTerm),
  );

  const pendingCount = withdrawals.filter((w) => w.status === "pending").length;
  const pendingVolume = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Withdrawal Queue</h1>
          <p className="text-gray-600">
            Approve or reject member withdrawal requests.
          </p>
        </div>

        <div className="flex space-x-3 mt-4 md:mt-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search members or accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            />
          </div>
          <button
            onClick={fetchQueue}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="Refresh Queue"
          >
            <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <p className="text-blue-600 text-sm font-medium">Pending Requests</p>
          <p className="text-2xl font-bold text-blue-900">
            {isLoading ? "..." : pendingCount}
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
          <p className="text-amber-600 text-sm font-medium">
            Total Pending Volume
          </p>
          <p className="text-2xl font-bold text-amber-900">
            ₦{isLoading ? "..." : pendingVolume.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
          <p className="text-green-600 text-sm font-medium">System Liquidity</p>
          <p className="text-2xl font-bold text-green-900">Healthy</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Account details
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredWithdrawals.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 overflow-hidden">
                        {req.user?.profilePicture ? (
                          <img
                            src={req.user.profilePicture}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {req.user?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {req.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      ₦{parseFloat(req.amount).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 font-medium max-w-[150px] truncate">
                      {req.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-700">
                      {req.account?.accountNumber}
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      {req.account?.accountType.replace("_", " ")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        req.status === "pending"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : req.status === "approved"
                            ? "bg-green-50 text-green-600 border border-green-100"
                            : "bg-red-50 text-red-600 border border-red-100"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center">
                      <FiClock className="mr-2" />
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {req.status === "pending" ? (
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleAction(req.id, "approved")}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <FiCheckCircle />
                        </button>
                        <button
                          onClick={() => handleAction(req.id, "rejected")}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <FiXCircle />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-xs text-slate-400 italic">
                        Processed
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredWithdrawals.length === 0 && (
          <div className="py-20 text-center">
            <FiCheckCircle className="text-5xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No withdrawal requests found.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="py-20 text-center text-slate-400">
            <FiRefreshCw className="animate-spin text-3xl mx-auto mb-2" />
            <p>Loading queue...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalQueue;
