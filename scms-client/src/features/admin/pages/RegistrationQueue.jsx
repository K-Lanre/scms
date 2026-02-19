import React, { useState } from "react";
import {
  FiUser,
  FiMail,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiFilter,
  FiSearch,
} from "react-icons/fi";

const RegistrationQueue = () => {
  const [filter, setFilter] = useState("all");

  // Mock data for registrations
  const registrations = [
    {
      id: "REG-001",
      name: "Alice Johnson",
      email: "alice@example.com",
      date: "2024-02-05",
      status: "pending",
      type: "Regular",
    },
    {
      id: "REG-002",
      name: "Bob Smith",
      email: "bob@example.com",
      date: "2024-02-06",
      status: "pending",
      type: "Premium",
    },
    {
      id: "REG-003",
      name: "Charlie Davis",
      email: "charlie@example.com",
      date: "2024-02-07",
      status: "pending",
      type: "Executive",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Registration Queue
          </h1>
          <p className="text-gray-600">
            Review and approve new membership applications.
          </p>
        </div>

        <div className="flex space-x-3 mt-4 md:mt-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <FiFilter />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registrations.map((reg) => (
                <tr
                  key={reg.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <FiUser />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {reg.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <FiMail className="mr-1" /> {reg.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {reg.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-gray-400" />
                      {new Date(reg.date).toLocaleDateString()}
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

        {registrations.length === 0 && (
          <div className="py-20 text-center">
            <FiCheckCircle className="text-5xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              All caught up! No pending registrations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationQueue;
