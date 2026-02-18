import React, { useState } from "react";
import { FiSearch, FiFilter, FiActivity } from "react-icons/fi";

const AuditLogs = () => {
  const [logs] = useState([
    {
      id: 1,
      action: "User Login",
      user: "admin@coop.com",
      ip: "192.168.1.1",
      time: "2024-02-02 10:30:45 AM",
      details: "Successful login",
    },
    {
      id: 2,
      action: "Update Settings",
      user: "admin@coop.com",
      ip: "192.168.1.1",
      time: "2024-02-02 10:35:12 AM",
      details: "Changed interest rate to 15%",
    },
    {
      id: 3,
      action: "Loan Approval",
      user: "staff@coop.com",
      ip: "192.168.1.5",
      time: "2024-02-02 09:45:00 AM",
      details: "Approved loan #LN-4522",
    },
    {
      id: 4,
      action: "Member Registration",
      user: "staff@coop.com",
      ip: "192.168.1.5",
      time: "2024-02-01 02:20:15 PM",
      details: "Registered new member John Doe",
    },
    {
      id: 5,
      action: "Failed Login",
      user: "unknown@ip",
      ip: "10.0.0.45",
      time: "2024-02-01 11:15:33 AM",
      details: "Invalid password attempt",
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Audit Logs</h1>
        <p className="text-gray-600">
          Track system activities and security events.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
            <FiFilter className="mr-2" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  User / IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-mono text-sm">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                    {log.time}
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-800 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiActivity className="mr-2 text-blue-500" />
                      {log.action}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-gray-900">{log.user}</div>
                    <div className="text-xs text-gray-400">{log.ip}</div>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
