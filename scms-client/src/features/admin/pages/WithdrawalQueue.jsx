import React, { useState } from "react";
import {
  FiDollarSign,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiFilter,
  FiSearch,
  FiArrowUpRight,
} from "react-icons/fi";

const WithdrawalQueue = () => {
  const [filter, setFilter] = useState("all");

  // Mock data for withdrawals
  const withdrawals = [
    {
      id: "WTH-001",
      memberName: "John Doe",
      memberId: "MEM-482",
      amount: 45000,
      accountType: "Savings",
      date: "2024-02-17",
      status: "pending",
      reason: "School Fees",
    },
    {
      id: "WTH-002",
      memberName: "Sarah Williams",
      memberId: "MEM-125",
      amount: 120000,
      accountType: "Target Savings",
      date: "2024-02-18",
      status: "pending",
      reason: "Emergency",
    },
    {
      id: "WTH-003",
      memberName: "Michael Chen",
      memberId: "MEM-889",
      amount: 15000,
      accountType: "Savings",
      date: "2024-02-18",
      status: "pending",
      reason: "Personal",
    },
  ];

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
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <FiFilter />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <p className="text-blue-600 text-sm font-medium">Pending Requests</p>
          <p className="text-2xl font-bold text-blue-900">
            {withdrawals.length}
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
          <p className="text-amber-600 text-sm font-medium">
            Total Pending Volume
          </p>
          <p className="text-2xl font-bold text-amber-900">
            ₦
            {withdrawals
              .reduce((acc, curr) => acc + curr.amount, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
          <p className="text-green-600 text-sm font-medium">
            Daily Limit Status
          </p>
          <p className="text-2xl font-bold text-green-900">75% Available</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                  Account Type
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
              {withdrawals.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <FiUser />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {req.memberName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {req.memberId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      ₦{req.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      Reason: {req.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-100">
                      {req.accountType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-gray-400" />
                      {new Date(req.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors title='View Details'">
                        <FiEye />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors title='Approve'">
                        <FiCheckCircle />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors title='Reject'">
                        <FiXCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {withdrawals.length === 0 && (
          <div className="py-20 text-center">
            <FiCheckCircle className="text-5xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              All caught up! No pending withdrawal requests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalQueue;
