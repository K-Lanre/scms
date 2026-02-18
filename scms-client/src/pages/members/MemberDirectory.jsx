import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiUserPlus,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiEye,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const MemberDirectory = () => {
  // eslint-disable-next-line no-unused-vars
  const { register, handleSubmit } = useForm();
  // eslint-disable-next-line no-unused-vars
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+234 812 345 6789",
      membershipNo: "COOP001",
      joinDate: "2023-01-15",
      savings: "₦250,000",
      loans: "₦150,000",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+234 812 999 8888",
      membershipNo: "COOP002",
      joinDate: "2023-02-20",
      savings: "₦120,500",
      loans: "₦0",
      status: "active",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "+234 812 777 6666",
      membershipNo: "COOP003",
      joinDate: "2023-03-10",
      savings: "₦450,000",
      loans: "₦200,000",
      status: "inactive",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Member Management
          </h1>
          <p className="text-gray-600">
            Manage all society members and their details
          </p>
        </div>
        <Link
          to="/members/register"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center shadow-sm font-medium"
        >
          <FiUserPlus className="mr-2" />
          Add New Member
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
            <option>All Categories</option>
            <option>Regular</option>
            <option>Premium</option>
            <option>Executive</option>
          </select>
          <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-700 font-medium transition-colors">
            <FiFilter className="mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Financials
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                          {member.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {member.membershipNo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FiMail className="mr-2 text-gray-400" />
                      {member.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <FiPhone className="mr-2 text-gray-400" />
                      {member.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center bg-gray-50 px-2 py-1 rounded inline-block">
                      <FiCalendar className="mr-2 text-gray-400" />
                      Joined: {member.joinDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center text-green-700 font-medium">
                        <span className="w-16 text-xs text-gray-500 uppercase">
                          Savings:
                        </span>
                        {member.savings}
                      </div>
                      <div className="flex items-center text-blue-700 font-medium">
                        <span className="w-16 text-xs text-gray-500 uppercase">
                          Loans:
                        </span>
                        {member.loans}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                        member.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : member.status === "inactive"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {member.status.charAt(0).toUpperCase() +
                        member.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <FiEye className="text-xl" />
                      </button>
                      <button className="text-gray-400 hover:text-green-600 transition-colors">
                        <FiEdit className="text-xl" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600 transition-colors">
                        <FiTrash2 className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - styled */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">1</span> to{" "}
            <span className="font-semibold text-gray-900">3</span> of{" "}
            <span className="font-semibold text-gray-900">100</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded bg-white text-sm hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <div className="flex space-x-1">
              <button className="px-3 py-1 border border-blue-600 bg-blue-600 text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50 rounded text-sm">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 bg-white hover:bg-gray-50 rounded text-sm">
                3
              </button>
            </div>
            <button className="px-3 py-1 border border-gray-300 rounded bg-white text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDirectory;
