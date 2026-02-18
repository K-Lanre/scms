import React, { useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const LoanRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      applicant: "John Doe",
      type: "Business Loan",
      amount: "₦500,000",
      date: "2024-02-01",
      status: "Pending",
      score: 85,
    },
    {
      id: 2,
      applicant: "Jane Smith",
      type: "Personal Loan",
      amount: "₦150,000",
      date: "2024-01-28",
      status: "Pending",
      score: 92,
    },
    {
      id: 3,
      applicant: "Robert Johnson",
      type: "Emergency Loan",
      amount: "₦50,000",
      date: "2024-02-02",
      status: "Under Review",
      score: 70,
    },
    {
      id: 4,
      applicant: "Sarah Williams",
      type: "Education Loan",
      amount: "₦200,000",
      date: "2024-01-30",
      status: "Rejected",
      score: 45,
    },
  ]);

  const handleAction = (id, action) => {
    alert(`${action} loan request #${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Loan Requests</h1>
          <p className="text-gray-600">
            Review and approve pending loan applications.
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium border border-blue-100">
            Pending: <span className="font-bold">3</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Loan Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Credit Score
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
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                        {req.applicant.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {req.applicant}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: MEM-{req.id + 100}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-semibold">
                      {req.amount}
                    </div>
                    <div className="text-xs text-gray-500">{req.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiClock className="mr-1.5 size-3" /> {req.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        req.score >= 80
                          ? "bg-green-100 text-green-800"
                          : req.score >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {req.score}/100
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                        req.status === "Pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : req.status === "Under Review"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction(req.id, "Approved")}
                        className="p-1 rounded text-green-600 hover:bg-green-50 tooltip"
                        title="Approve"
                      >
                        <FiCheckCircle className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "Rejected")}
                        className="p-1 rounded text-red-600 hover:bg-red-50"
                        title="Reject"
                      >
                        <FiXCircle className="text-xl" />
                      </button>
                      <button
                        className="p-1 rounded text-blue-600 hover:bg-blue-50"
                        title="View Details"
                      >
                        <FiEye className="text-xl" />
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

export default LoanRequests;
