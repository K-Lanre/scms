import React, { useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiShield,
} from "react-icons/fi";

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@coop.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-02-02 10:30 AM",
    },
    {
      id: 2,
      name: "Staff Member",
      email: "staff@coop.com",
      role: "Staff",
      status: "Active",
      lastLogin: "2024-02-02 09:15 AM",
    },
    {
      id: 3,
      name: "John Doe",
      email: "john@example.com",
      role: "Member",
      status: "Active",
      lastLogin: "2024-02-01 04:45 PM",
    },
    {
      id: 4,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Member",
      status: "Suspended",
      lastLogin: "2024-01-25 11:20 AM",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">
            Manage system users, roles, and permissions.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <FiPlus className="mr-2" /> Add New User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Last Login
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      <FiShield className="mr-2 text-gray-400" />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                        <FiEdit2 />
                      </button>
                      {user.status === "Active" ? (
                        <button
                          className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                          title="Suspend"
                        >
                          <FiUserX />
                        </button>
                      ) : (
                        <button
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                          title="Activate"
                        >
                          <FiUserCheck />
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
